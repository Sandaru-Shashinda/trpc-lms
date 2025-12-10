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
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ ctx, input }) => {
      const hasAccess = await enrollmentService.checkLessonAccess(
        ctx.user._id.toString(),
        input.lessonId
      );
      return { hasAccess };
    }),

  updateProgress: studentProcedure
    .input(
      z.object({
        lessonId: z.string(),
        completionPercentage: z.number().min(0).max(100).optional(),
        lastWatchedPosition: z.number().optional(),
        isCompleted: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { lessonId, ...data } = input;
      return await enrollmentService.updateProgress(ctx.user._id.toString(), lessonId, data);
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
