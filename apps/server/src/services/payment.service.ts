import { Payment, IPayment } from '../models/Payment.model';
import { Enrollment } from '../models/Enrollment.model';
import { Class } from '../models/Class.model';
import { enrollmentService } from './enrollment.service';
import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

interface CreatePaymentInput {
  enrollmentId: string;
  monthNumber: number;
  paymentMethod: 'card' | 'upi' | 'wallet' | 'paypal';
}

export class PaymentService {
  async createPayment(studentId: string, input: CreatePaymentInput) {
    const enrollment = await Enrollment.findById(input.enrollmentId)
      .populate('classId');

    if (!enrollment) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Enrollment not found',
      });
    }

    if (enrollment.studentId.toString() !== studentId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Invalid enrollment',
      });
    }

    // Check if month is already paid
    if (enrollment.unlockedMonths.includes(input.monthNumber)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'This month has already been paid',
      });
    }

    const classData = enrollment.classId as any;

    // Calculate fees
    const amount = classData.monthlyFee;
    const platformFeePercentage = parseInt(process.env.PLATFORM_FEE_PERCENTAGE || '10');
    const platformFee = (amount * platformFeePercentage) / 100;
    const teacherEarnings = amount - platformFee;

    // Generate transaction ID (in real app, this comes from payment gateway)
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create payment record
    const payment = await Payment.create({
      studentId: new mongoose.Types.ObjectId(studentId),
      teacherId: enrollment.teacherId,
      classId: enrollment.classId,
      enrollmentId: new mongoose.Types.ObjectId(input.enrollmentId),
      amount,
      currency: classData.currency || 'USD',
      monthNumber: input.monthNumber,
      paymentMethod: input.paymentMethod,
      transactionId,
      paymentGateway: 'stripe', // Mock for now
      status: 'completed', // In real app, would be 'pending' initially
      platformFee,
      teacherEarnings,
      paidAt: new Date(),
    });

    // Unlock month for student
    await enrollmentService.unlockMonth(input.enrollmentId, input.monthNumber);

    // Update enrollment payment tracking
    enrollment.lastPaymentDate = new Date();
    enrollment.totalAmountPaid += amount;

    // Calculate next payment date (30 days from now)
    const nextPaymentDate = new Date();
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);
    enrollment.nextPaymentDate = nextPaymentDate;

    await enrollment.save();

    // Update class total revenue
    const updatedClass = await Class.findById(enrollment.classId);
    if (updatedClass) {
      updatedClass.totalRevenue += amount;
      await updatedClass.save();
    }

    return payment;
  }

  async getStudentPayments(studentId: string) {
    const payments = await Payment.find({ studentId })
      .populate('classId', 'title')
      .sort({ createdAt: -1 });

    return payments;
  }

  async getTeacherPayments(teacherId: string) {
    const payments = await Payment.find({
      teacherId,
      status: 'completed',
    })
      .populate('classId', 'title')
      .populate('studentId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return payments;
  }

  async getPaymentById(paymentId: string) {
    const payment = await Payment.findById(paymentId)
      .populate('classId', 'title')
      .populate('studentId', 'firstName lastName email')
      .populate('teacherId', 'firstName lastName');

    if (!payment) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Payment not found',
      });
    }

    return payment;
  }

  async getTeacherEarnings(teacherId: string) {
    const result = await Payment.aggregate([
      {
        $match: {
          teacherId: new mongoose.Types.ObjectId(teacherId),
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$teacherEarnings' },
          totalPayments: { $sum: 1 },
        },
      },
    ]);

    return result[0] || { totalEarnings: 0, totalPayments: 0 };
  }
}

export const paymentService = new PaymentService();
