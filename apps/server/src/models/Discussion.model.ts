import mongoose, { Schema, Document } from 'mongoose';

export interface IDiscussion extends Document {
  authorId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  lessonId?: mongoose.Types.ObjectId;

  title?: string;
  content: string;
  type: 'question' | 'announcement';

  replies: Array<{
    replyId: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    content: string;
    isTeacherReply: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;

  isResolved: boolean;
  resolvedAt?: Date;

  replyCount: number;

  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const discussionSchema = new Schema<IDiscussion>(
  {
    authorId: {
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
    },

    title: String,
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['question', 'announcement'],
      default: 'question',
    },

    replies: [
      {
        replyId: Schema.Types.ObjectId,
        authorId: { type: Schema.Types.ObjectId, ref: 'User' },
        content: String,
        isTeacherReply: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],

    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: Date,

    replyCount: {
      type: Number,
      default: 0,
    },

    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
discussionSchema.index({ classId: 1, createdAt: -1 });
discussionSchema.index({ lessonId: 1 });
discussionSchema.index({ authorId: 1 });

export const Discussion = mongoose.model<IDiscussion>('Discussion', discussionSchema);
