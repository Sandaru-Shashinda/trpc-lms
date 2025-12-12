import { router, protectedProcedure, teacherProcedure } from '../trpc/trpc';
import { discussionService } from '../services/discussion.service';
import { z } from 'zod';

export const discussionRouter = router({
  // Create a new discussion/question
  create: protectedProcedure
    .input(
      z.object({
        classId: z.string(),
        lessonId: z.string().optional(),
        title: z.string().min(1).max(200).optional(),
        content: z.string().min(1),
        type: z.enum(['question', 'announcement']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await discussionService.createDiscussion(ctx.user._id.toString(), input);
    }),

  // Get all discussions for a class
  getClassDiscussions: protectedProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ input }) => {
      return await discussionService.getClassDiscussions(input.classId);
    }),

  // Get discussions for a specific lesson
  getLessonDiscussions: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ input }) => {
      return await discussionService.getLessonDiscussions(input.lessonId);
    }),

  // Get a single discussion by ID with replies
  getById: protectedProcedure
    .input(z.object({ discussionId: z.string() }))
    .query(async ({ input }) => {
      return await discussionService.getDiscussionById(input.discussionId);
    }),

  // Add a reply to a discussion
  addReply: protectedProcedure
    .input(
      z.object({
        discussionId: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await discussionService.addReply(
        ctx.user._id.toString(),
        input.discussionId,
        input.content
      );
    }),

  // Mark discussion as resolved (teacher only)
  markAsResolved: teacherProcedure
    .input(z.object({ discussionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await discussionService.markAsResolved(
        ctx.user._id.toString(),
        input.discussionId
      );
    }),

  // Delete a discussion
  delete: protectedProcedure
    .input(z.object({ discussionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await discussionService.deleteDiscussion(
        ctx.user._id.toString(),
        input.discussionId
      );
    }),
});
