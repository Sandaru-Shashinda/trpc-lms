import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  studentId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  enrollmentId: mongoose.Types.ObjectId;

  amount: number;
  currency: string;
  monthNumber: number; // Which month is being paid for

  paymentMethod: 'card' | 'upi' | 'wallet' | 'paypal';
  transactionId: string;
  paymentGateway: 'stripe' | 'paypal' | 'razorpay';
  gatewayTransactionId?: string;

  status: 'pending' | 'completed' | 'failed' | 'refunded';

  billingDetails?: {
    name: string;
    email: string;
    phone?: string;
  };

  platformFee: number;
  teacherEarnings: number;

  invoiceNumber?: string;
  invoiceUrl?: string;

  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;

  failureReason?: string;

  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    enrollmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    monthNumber: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'wallet', 'paypal'],
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentGateway: {
      type: String,
      enum: ['stripe', 'paypal', 'razorpay'],
    },
    gatewayTransactionId: String,

    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },

    billingDetails: {
      name: String,
      email: String,
      phone: String,
    },

    platformFee: {
      type: Number,
      default: 0,
    },
    teacherEarnings: {
      type: Number,
      required: true,
    },

    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    invoiceUrl: String,

    refundAmount: Number,
    refundReason: String,
    refundedAt: Date,

    failureReason: String,

    paidAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ transactionId: 1 }, { unique: true });
paymentSchema.index({ studentId: 1, status: 1 });
paymentSchema.index({ teacherId: 1, status: 1 });
paymentSchema.index({ enrollmentId: 1 });
paymentSchema.index({ createdAt: -1 });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
