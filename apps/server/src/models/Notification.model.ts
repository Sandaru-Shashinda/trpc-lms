import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;

  type:
    | 'enrollment_confirmation'
    | 'payment_success'
    | 'payment_failed'
    | 'new_lesson'
    | 'class_announcement'
    | 'subscription_expiry'
    | 'discussion_reply'
    | 'teacher_approved';

  title: string;
  message: string;

  relatedId?: mongoose.Types.ObjectId;
  relatedType?: string; // 'class', 'lesson', 'payment', etc.

  actionUrl?: string;

  isRead: boolean;
  readAt?: Date;

  emailSent: boolean;
  emailSentAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    type: {
      type: String,
      enum: [
        'enrollment_confirmation',
        'payment_success',
        'payment_failed',
        'new_lesson',
        'class_announcement',
        'subscription_expiry',
        'discussion_reply',
        'teacher_approved',
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    relatedId: Schema.Types.ObjectId,
    relatedType: String,

    actionUrl: String,

    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,

    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
