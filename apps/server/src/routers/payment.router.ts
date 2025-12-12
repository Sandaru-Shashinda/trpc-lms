import { router, studentProcedure, teacherProcedure } from '../trpc/trpc';
import { paymentService } from '../services/payment.service';
import { z } from 'zod';

export const paymentRouter = router({
  // Student endpoints
  createPayment: studentProcedure
    .input(
      z.object({
        enrollmentId: z.string(),
        monthNumber: z.number().min(1),
        paymentMethod: z.enum(['card', 'upi', 'wallet', 'paypal']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await paymentService.createPayment(ctx.user._id.toString(), input);
    }),

  getMyPayments: studentProcedure.query(async ({ ctx }) => {
    return await paymentService.getStudentPayments(ctx.user._id.toString());
  }),

  getById: studentProcedure
    .input(z.object({ paymentId: z.string() }))
    .query(async ({ input }) => {
      return await paymentService.getPaymentById(input.paymentId);
    }),

  // Teacher endpoints
  getMyEarnings: teacherProcedure.query(async ({ ctx }) => {
    return await paymentService.getTeacherEarnings(ctx.user._id.toString());
  }),

  getMyPaymentHistory: teacherProcedure.query(async ({ ctx }) => {
    return await paymentService.getTeacherPayments(ctx.user._id.toString());
  }),
});
