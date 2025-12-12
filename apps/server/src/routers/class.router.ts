import { router, teacherProcedure, publicProcedure } from '../trpc/trpc';
import { classService } from '../services/class.service';
import { z } from 'zod';

export const classRouter = router({
  // Teacher endpoints
  create: teacherProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(10),
        shortDescription: z.string().optional(),
        category: z.string().min(1),
        level: z.enum(['beginner', 'intermediate', 'advanced', 'all']),
        monthlyFee: z.number().min(0),
        requirements: z.array(z.string()).optional(),
        whatYouWillLearn: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await classService.createClass(ctx.user._id.toString(), input);
    }),

  update: teacherProcedure
    .input(
      z.object({
        classId: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        category: z.string().optional(),
        level: z.enum(['beginner', 'intermediate', 'advanced', 'all']).optional(),
        monthlyFee: z.number().min(0).optional(),
        requirements: z.array(z.string()).optional(),
        whatYouWillLearn: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await classService.updateClass(ctx.user._id.toString(), input);
    }),

  publish: teacherProcedure
    .input(z.object({ classId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await classService.publishClass(ctx.user._id.toString(), input.classId);
    }),

  getMyClasses: teacherProcedure.query(async ({ ctx }) => {
    return await classService.getTeacherClasses(ctx.user._id.toString());
  }),

  delete: teacherProcedure
    .input(z.object({ classId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await classService.deleteClass(ctx.user._id.toString(), input.classId);
    }),

  // Public/Student endpoints
  getPublished: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          level: z.string().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return await classService.getPublishedClasses(input);
    }),

  getById: publicProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ input }) => {
      return await classService.getClassById(input.classId);
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await classService.getClassBySlug(input.slug);
    }),
});
