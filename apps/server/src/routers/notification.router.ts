import { router, protectedProcedure } from '../trpc/trpc';
import { notificationService } from '../services/notification.service';
import { z } from 'zod';

export const notificationRouter = router({
  // Get all notifications for current user
  getMyNotifications: protectedProcedure.query(async ({ ctx }) => {
    return await notificationService.getUserNotifications(ctx.user._id.toString());
  }),

  // Get unread count
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return await notificationService.getUnreadCount(ctx.user._id.toString());
  }),

  // Mark notification as read
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await notificationService.markAsRead(
        ctx.user._id.toString(),
        input.notificationId
      );
    }),

  // Mark all as read
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    return await notificationService.markAllAsRead(ctx.user._id.toString());
  }),

  // Delete notification
  delete: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await notificationService.deleteNotification(
        ctx.user._id.toString(),
        input.notificationId
      );
    }),
});
