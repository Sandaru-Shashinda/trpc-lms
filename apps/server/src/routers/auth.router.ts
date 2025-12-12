import { router, publicProcedure, protectedProcedure } from '../trpc/trpc';
import { authService } from '../services/auth.service';
import { z } from 'zod';

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        role: z.enum(['student', 'teacher']),
      })
    )
    .mutation(async ({ input }) => {
      return await authService.register(input);
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await authService.login(input);
    }),

  getMe: protectedProcedure.query(async ({ ctx }) => {
    return await authService.getMe(ctx.user._id.toString());
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        bio: z.string().optional(),
        headline: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await authService.getMe(ctx.user._id.toString());

      if (input.firstName) user.firstName = input.firstName;
      if (input.lastName) user.lastName = input.lastName;
      if (input.bio !== undefined) user.bio = input.bio;
      if (input.headline !== undefined) user.headline = input.headline;
      if (input.phone !== undefined) user.phone = input.phone;

      await user.save();
      return user;
    }),

  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(6, 'New password must be at least 6 characters'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await authService.changePassword(
        ctx.user._id.toString(),
        input.currentPassword,
        input.newPassword
      );
    }),
});
