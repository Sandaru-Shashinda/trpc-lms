import { Enrollment } from '../models/Enrollment.model';
import { Class } from '../models/Class.model';
import { User } from '../models/User.model';
import { Lesson } from '../models/Lesson.model';
import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

export class EnrollmentService {
  async enrollInClass(studentId: string, classId: string) {
    // Check if student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only students can enroll in classes',
      });
    }

    // Check if class exists and is published
    const classData = await Class.findById(classId);
    if (!classData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Class not found',
      });
    }

    if (classData.status !== 'published') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'This class is not available for enrollment',
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId,
      classId,
    });

    if (existingEnrollment) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'You are already enrolled in this class',
      });
    }

    // Get total lessons count
    const totalLessons = await Lesson.countDocuments({
      classId,
      status: 'published',
    });

    // Create enrollment (free enrollment, payment required for access)
    const enrollment = await Enrollment.create({
      studentId: new mongoose.Types.ObjectId(studentId),
      classId: new mongoose.Types.ObjectId(classId),
      teacherId: classData.teacherId,
      enrollmentDate: new Date(),
      status: 'active',
      subscriptionStatus: 'active',
      currentMonth: 1,
      totalMonthsPaid: 0,
      monthlyFee: classData.monthlyFee,
      totalAmountPaid: 0,
      hasAccess: false, // No access until first payment
      unlockedMonths: [],
      progress: {
        completedLessons: [],
        totalLessons,
        completionPercentage: 0,
        totalTimeSpent: 0,
      },
    });

    // Update class enrollment count
    classData.totalEnrollments += 1;
    classData.activeEnrollments += 1;
    await classData.save();

    // Update student's enrolled classes
    if (student.studentProfile) {
      student.studentProfile.enrolledClasses.push(new mongoose.Types.ObjectId(classId));
      await student.save();
    }

    // Update teacher's total students
    const teacher = await User.findById(classData.teacherId);
    if (teacher && teacher.teacherProfile) {
      teacher.teacherProfile.totalStudents += 1;
      await teacher.save();
    }

    return enrollment;
  }

  async getStudentEnrollments(studentId: string) {
    const enrollments = await Enrollment.find({ studentId })
      .populate('classId', 'title thumbnail category level')
      .populate('teacherId', 'firstName lastName profilePicture')
      .sort({ enrollmentDate: -1 });

    return enrollments;
  }

  async getEnrollmentById(enrollmentId: string) {
    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('classId')
      .populate('teacherId', 'firstName lastName profilePicture')
      .populate('studentId', 'firstName lastName email');

    if (!enrollment) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Enrollment not found',
      });
    }

    return enrollment;
  }

  async checkLessonAccess(studentId: string, lessonId: string): Promise<boolean> {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Lesson not found',
      });
    }

    // Free lessons are accessible to all enrolled students
    if (lesson.isFree) {
      const enrollment = await Enrollment.findOne({
        studentId,
        classId: lesson.classId,
      });
      return !!enrollment;
    }

    // Check if student has paid for the month
    const enrollment = await Enrollment.findOne({
      studentId,
      classId: lesson.classId,
      status: 'active',
    });

    if (!enrollment) {
      return false;
    }

    return enrollment.unlockedMonths.includes(lesson.monthNumber);
  }

  async unlockMonth(enrollmentId: string, monthNumber: number) {
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Enrollment not found',
      });
    }

    // Add month to unlocked months if not already there
    if (!enrollment.unlockedMonths.includes(monthNumber)) {
      enrollment.unlockedMonths.push(monthNumber);
      enrollment.totalMonthsPaid += 1;
      enrollment.hasAccess = true;
    }

    await enrollment.save();
    return enrollment;
  }

  async cancelEnrollment(studentId: string, enrollmentId: string) {
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Enrollment not found',
      });
    }

    if (enrollment.studentId.toString() !== studentId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You can only cancel your own enrollments',
      });
    }

    enrollment.status = 'cancelled';
    enrollment.subscriptionStatus = 'cancelled';
    enrollment.cancelledAt = new Date();
    await enrollment.save();

    // Update class active enrollments
    const classData = await Class.findById(enrollment.classId);
    if (classData) {
      classData.activeEnrollments = Math.max(0, classData.activeEnrollments - 1);
      await classData.save();
    }

    return enrollment;
  }

  async checkMonthAccess(studentId: string, classId: string, month: number) {
    const enrollment = await Enrollment.findOne({
      studentId,
      classId,
      status: 'active',
    });

    if (!enrollment) {
      return {
        hasAccess: false,
        isCompleted: false,
        watchPosition: 0,
      };
    }

    const hasAccess = enrollment.unlockedMonths.includes(month);

    return {
      hasAccess,
      isCompleted: false,
      watchPosition: 0,
    };
  }

  async updateLessonProgress(
    studentId: string,
    classId: string,
    lessonId: string
  ) {
    const enrollment = await Enrollment.findOne({
      studentId,
      classId,
      status: 'active',
    });

    if (!enrollment) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Enrollment not found',
      });
    }

    enrollment.progress.lastAccessedLesson = new mongoose.Types.ObjectId(lessonId);
    enrollment.progress.lastAccessedAt = new Date();

    await enrollment.save();

    return { success: true };
  }

  async markLessonComplete(studentId: string, classId: string, lessonId: string) {
    const enrollment = await Enrollment.findOne({
      studentId,
      classId,
      status: 'active',
    });

    if (!enrollment) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Enrollment not found',
      });
    }

    // Add to completed lessons if not already there
    const lessonObjectId = new mongoose.Types.ObjectId(lessonId);
    if (!enrollment.progress.completedLessons.some((id) => id.equals(lessonObjectId))) {
      enrollment.progress.completedLessons.push(lessonObjectId);

      // Update completion percentage
      enrollment.progress.completionPercentage =
        (enrollment.progress.completedLessons.length / enrollment.progress.totalLessons) * 100;
    }

    enrollment.progress.lastAccessedLesson = lessonObjectId;
    enrollment.progress.lastAccessedAt = new Date();

    await enrollment.save();

    return { success: true, enrollment };
  }

  async updateProgress(studentId: string, lessonId: string, data: {
    completionPercentage?: number;
    lastWatchedPosition?: number;
    isCompleted?: boolean;
  }) {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Lesson not found',
      });
    }

    const enrollment = await Enrollment.findOne({
      studentId,
      classId: lesson.classId,
      status: 'active',
    });

    if (!enrollment) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Enrollment not found',
      });
    }

    // Add to completed lessons if marked as complete
    if (data.isCompleted && !enrollment.progress.completedLessons.includes(new mongoose.Types.ObjectId(lessonId))) {
      enrollment.progress.completedLessons.push(new mongoose.Types.ObjectId(lessonId));
    }

    // Update completion percentage
    enrollment.progress.completionPercentage =
      (enrollment.progress.completedLessons.length / enrollment.progress.totalLessons) * 100;

    enrollment.progress.lastAccessedLesson = new mongoose.Types.ObjectId(lessonId);
    enrollment.progress.lastAccessedAt = new Date();

    await enrollment.save();

    return enrollment;
  }
}

export const enrollmentService = new EnrollmentService();
