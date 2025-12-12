import { router, studentProcedure, protectedProcedure } from '../trpc/trpc';
import { enrollmentService } from '../services/enrollment.service';
import { z } from 'zod';

export const enrollmentRouter = router({
  enroll: studentProcedure
    .input(z.object({ classId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await enrollmentService.enrollInClass(ctx.user._id.toString(), input.classId);
    }),

  getMyEnrollments: studentProcedure.query(async ({ ctx }) => {
    return await enrollmentService.getStudentEnrollments(ctx.user._id.toString());
  }),

  getById: protectedProcedure
    .input(z.object({ enrollmentId: z.string() }))
    .query(async ({ input }) => {
      return await enrollmentService.getEnrollmentById(input.enrollmentId);
    }),

  checkAccess: studentProcedure
    .input(z.object({ classId: z.string(), month: z.number() }))
    .query(async ({ ctx, input }) => {
      const hasAccess = await enrollmentService.checkMonthAccess(
        ctx.user._id.toString(),
        input.classId,
        input.month
      );
      return hasAccess;
    }),

  updateProgress: studentProcedure
    .input(
      z.object({
        classId: z.string(),
        lessonId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await enrollmentService.updateLessonProgress(
        ctx.user._id.toString(),
        input.classId,
        input.lessonId
      );
    }),

  markLessonComplete: studentProcedure
    .input(
      z.object({
        classId: z.string(),
        lessonId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await enrollmentService.markLessonComplete(
        ctx.user._id.toString(),
        input.classId,
        input.lessonId
      );
    }),

  cancel: studentProcedure
    .input(z.object({ enrollmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await enrollmentService.cancelEnrollment(
        ctx.user._id.toString(),
        input.enrollmentId
      );
    }),
});
