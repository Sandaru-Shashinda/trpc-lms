import mongoose, { Schema, Document } from 'mongoose';

export interface ILessonProgress extends Document {
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  enrollmentId: mongoose.Types.ObjectId;

  status: 'not_started' | 'in_progress' | 'completed';
  completionPercentage: number;

  // Video Progress
  lastWatchedPosition: number; // in seconds
  totalWatchTime: number; // total seconds watched

  isCompleted: boolean;
  completedAt?: Date;

  firstAccessedAt?: Date;
  lastAccessedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const lessonProgressSchema = new Schema<ILessonProgress>(
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
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    enrollmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
    },

    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    lastWatchedPosition: {
      type: Number,
      default: 0,
    },
    totalWatchTime: {
      type: Number,
      default: 0,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,

    firstAccessedAt: Date,
    lastAccessedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
lessonProgressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });
lessonProgressSchema.index({ enrollmentId: 1 });
lessonProgressSchema.index({ classId: 1, studentId: 1 });

export const LessonProgress = mongoose.model<ILessonProgress>('LessonProgress', lessonProgressSchema);
