import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
  classId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  moduleId?: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  order: number;
  contentType: 'video' | 'document' | 'text';

  // Video content (YouTube)
  videoUrl?: string;
  videoId?: string; // YouTube video ID
  videoThumbnail?: string;
  videoDuration?: number; // in seconds

  // Document content
  documentUrl?: string;
  documentType?: string;

  // Text content
  textContent?: string;

  // Resources
  resources: Array<{
    title: string;
    url: string;
    type: string;
    size?: number;
  }>;

  // Access Control
  isFree: boolean;
  monthNumber: number; // Which month this lesson belongs to

  // Status
  status: 'draft' | 'published';
  isActive: boolean;

  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
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
    moduleId: Schema.Types.ObjectId,
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: String,
    order: {
      type: Number,
      required: true,
    },
    contentType: {
      type: String,
      enum: ['video', 'document', 'text'],
      required: true,
    },

    // Video content
    videoUrl: String,
    videoId: String,
    videoThumbnail: String,
    videoDuration: Number,

    // Document content
    documentUrl: String,
    documentType: String,

    // Text content
    textContent: String,

    // Resources
    resources: [
      {
        title: String,
        url: String,
        type: String,
        size: Number,
      },
    ],

    // Access Control
    isFree: {
      type: Boolean,
      default: false,
    },
    monthNumber: {
      type: Number,
      required: true,
    },

    // Status
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    publishedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
lessonSchema.index({ classId: 1, order: 1 });
lessonSchema.index({ teacherId: 1 });
lessonSchema.index({ slug: 1, classId: 1 }, { unique: true });
lessonSchema.index({ monthNumber: 1 });

export const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);
