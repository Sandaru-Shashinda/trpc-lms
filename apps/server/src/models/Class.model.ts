import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  teacherId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  language: string;
  monthlyFee: number;
  currency: string;
  duration?: number;
  estimatedHours?: number;
  modules: Array<{
    moduleId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    order: number;
    lessons: mongoose.Types.ObjectId[];
  }>;
  totalLessons: number;
  requirements: string[];
  whatYouWillLearn: string[];
  status: 'draft' | 'published' | 'archived';
  isActive: boolean;
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  totalEnrollments: number;
  activeEnrollments: number;
  totalRevenue: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: String,
    thumbnail: String,
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all'],
      default: 'all',
    },
    language: {
      type: String,
      default: 'en',
    },
    monthlyFee: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    duration: Number,
    estimatedHours: Number,
    modules: [
      {
        moduleId: Schema.Types.ObjectId,
        title: String,
        description: String,
        order: Number,
        lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
      },
    ],
    totalLessons: {
      type: Number,
      default: 0,
    },
    requirements: [String],
    whatYouWillLearn: [String],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
    totalEnrollments: {
      type: Number,
      default: 0,
    },
    activeEnrollments: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    publishedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
classSchema.index({ teacherId: 1 });
classSchema.index({ slug: 1 }, { unique: true });
classSchema.index({ status: 1, isActive: 1 });
classSchema.index({ category: 1 });
classSchema.index({ title: 'text', description: 'text' });

export const Class = mongoose.model<IClass>('Class', classSchema);
