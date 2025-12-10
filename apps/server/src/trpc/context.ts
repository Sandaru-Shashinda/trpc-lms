import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.model';

export const createContext = async ({ req, res }: CreateExpressContextOptions) => {
  // Get token from header or cookie
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;

  let user: IUser | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      user = await User.findById(decoded.userId).select('-password');
    } catch (error) {
      // Invalid token - user remains null
    }
  }

  return {
    req,
    res,
    user,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
