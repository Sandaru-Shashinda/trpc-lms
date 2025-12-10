import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;

  enrollmentDate: Date;
  status: 'active' | 'cancelled' | 'completed' | 'expired';

  // Subscription
  subscriptionStatus: 'active' | 'cancelled' | 'expired';
  currentMonth: number;
  totalMonthsPaid: number;

  // Payment Tracking
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  monthlyFee: number;
  totalAmountPaid: number;

  // Access Control
  hasAccess: boolean;
  accessExpiresAt?: Date;
  unlockedMonths: number[]; // [1, 2, 3] - months the student has paid for

  // Progress Tracking
  progress: {
    completedLessons: mongoose.Types.ObjectId[];
    totalLessons: number;
    completionPercentage: number;
    lastAccessedLesson?: mongoose.Types.ObjectId;
    lastAccessedAt?: Date;
    totalTimeSpent: number; // in minutes
  };

  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed', 'expired'],
      default: 'active',
    },

    // Subscription
    subscriptionStatus: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active',
    },
    currentMonth: {
      type: Number,
      default: 1,
    },
    totalMonthsPaid: {
      type: Number,
      default: 0,
    },

    // Payment Tracking
    lastPaymentDate: Date,
    nextPaymentDate: Date,
    monthlyFee: {
      type: Number,
      required: true,
    },
    totalAmountPaid: {
      type: Number,
      default: 0,
    },

    // Access Control
    hasAccess: {
      type: Boolean,
      default: true,
    },
    accessExpiresAt: Date,
    unlockedMonths: {
      type: [Number],
      default: [],
    },

    // Progress Tracking
    progress: {
      completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
      totalLessons: { type: Number, default: 0 },
      completionPercentage: { type: Number, default: 0 },
      lastAccessedLesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
      lastAccessedAt: Date,
      totalTimeSpent: { type: Number, default: 0 },
    },

    completedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
enrollmentSchema.index({ studentId: 1, classId: 1 }, { unique: true });
enrollmentSchema.index({ classId: 1, status: 1 });
enrollmentSchema.index({ studentId: 1, status: 1 });
enrollmentSchema.index({ subscriptionStatus: 1, nextPaymentDate: 1 });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
