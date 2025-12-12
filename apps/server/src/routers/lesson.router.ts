import { router, teacherProcedure, protectedProcedure } from '../trpc/trpc';
import { lessonService } from '../services/lesson.service';
import { z } from 'zod';

export const lessonRouter = router({
  // Teacher endpoints
  create: teacherProcedure
    .input(
      z.object({
        classId: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        contentType: z.enum(['video', 'document', 'text']),
        videoUrl: z.string().url().optional(),
        documentUrl: z.string().url().optional(),
        textContent: z.string().optional(),
        monthNumber: z.number().min(1),
        isFree: z.boolean().optional(),
        resources: z
          .array(
            z.object({
              title: z.string(),
              url: z.string().url(),
              type: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await lessonService.createLesson(ctx.user._id.toString(), input);
    }),

  update: teacherProcedure
    .input(
      z.object({
        lessonId: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        videoUrl: z.string().url().optional(),
        documentUrl: z.string().url().optional(),
        textContent: z.string().optional(),
        monthNumber: z.number().min(1).optional(),
        isFree: z.boolean().optional(),
        resources: z
          .array(
            z.object({
              title: z.string(),
              url: z.string().url(),
              type: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await lessonService.updateLesson(ctx.user._id.toString(), input);
    }),

  publish: teacherProcedure
    .input(z.object({ lessonId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await lessonService.publishLesson(ctx.user._id.toString(), input.lessonId);
    }),

  delete: teacherProcedure
    .input(z.object({ lessonId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await lessonService.deleteLesson(ctx.user._id.toString(), input.lessonId);
    }),

  // Student endpoints
  getClassLessons: protectedProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await lessonService.getClassLessons(input.classId, ctx.user._id.toString());
    }),

  getById: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await lessonService.getLessonById(input.lessonId, ctx.user._id.toString());
    }),
});
