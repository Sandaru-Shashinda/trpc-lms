import { router, protectedProcedure } from '../trpc/trpc';
import { userService } from '../services/user.service';
import { z } from 'zod';

export const userRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return await userService.getUserProfile(ctx.user._id.toString());
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await userService.updateProfile(ctx.user._id.toString(), input);
    }),
});
