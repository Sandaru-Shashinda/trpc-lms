import type { INotification } from '../models/Notification.model';
import { Notification } from '../models/Notification.model';
import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

export class NotificationService {
  async getUserNotifications(userId: string) {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return notifications;
  }

  async getUnreadCount(userId: string) {
    const count = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    return { count };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await Notification.findOne({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Notification not found',
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return notification;
  }

  async markAllAsRead(userId: string) {
    await Notification.updateMany(
      { userId, isRead: false },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

    return { success: true };
  }

  async createNotification(data: {
    userId: string;
    type: INotification['type'];
    title: string;
    message: string;
    relatedId?: string;
    relatedType?: string;
    actionUrl?: string;
  }) {
    const notification = await Notification.create({
      userId: new mongoose.Types.ObjectId(data.userId),
      type: data.type,
      title: data.title,
      message: data.message,
      relatedId: data.relatedId ? new mongoose.Types.ObjectId(data.relatedId) : undefined,
      relatedType: data.relatedType,
      actionUrl: data.actionUrl,
    });

    return notification;
  }

  async deleteNotification(userId: string, notificationId: string) {
    const notification = await Notification.findOne({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Notification not found',
      });
    }

    await notification.deleteOne();

    return { success: true };
  }
}

export const notificationService = new NotificationService();
