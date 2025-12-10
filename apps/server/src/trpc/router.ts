import { router } from './trpc';
import { authRouter } from '../routers/auth.router';
import { classRouter } from '../routers/class.router';
import { lessonRouter } from '../routers/lesson.router';
import { enrollmentRouter } from '../routers/enrollment.router';
import { paymentRouter } from '../routers/payment.router';

export const appRouter = router({
  auth: authRouter,
  class: classRouter,
  lesson: lessonRouter,
  enrollment: enrollmentRouter,
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;
