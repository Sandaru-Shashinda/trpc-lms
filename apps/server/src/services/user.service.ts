import { User } from '../models/User.model';
import { TRPCError } from '@trpc/server';

interface UpdateProfileInput {
  name?: string;
  email?: string;
}

export class UserService {
  async getUserProfile(userId: string) {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return {
      _id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      avatarUrl: user.profilePicture,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await User.findById(userId);

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    // Update name (split into firstName and lastName)
    if (input.name) {
      const nameParts = input.name.trim().split(' ');
      user.firstName = nameParts[0];
      user.lastName = nameParts.slice(1).join(' ') || nameParts[0];
    }

    // Update email
    if (input.email && input.email !== user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email: input.email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Email is already in use',
        });
      }
      user.email = input.email.toLowerCase();
    }

    await user.save();

    return {
      _id: user._id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      avatarUrl: user.profilePicture,
    };
  }
}

export const userService = new UserService();
