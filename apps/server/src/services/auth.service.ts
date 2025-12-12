import { User } from '../models/User.model';
import { hashPassword, comparePassword } from '../utils/bcrypt.utils';
import { generateToken } from '../utils/jwt.utils';
import { TRPCError } from '@trpc/server';

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher';
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    profilePicture?: string;
  };
  token: string;
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });

    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(input.password);

    // Create user with role-specific profile
    const userData: any = {
      email: input.email.toLowerCase(),
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
    };

    // Initialize profile based on role
    if (input.role === 'teacher') {
      userData.teacherProfile = {
        expertise: [],
        totalStudents: 0,
        totalClasses: 0,
        isApproved: false,
      };
    } else if (input.role === 'student') {
      userData.studentProfile = {
        enrolledClasses: [],
        interests: [],
        totalCoursesCompleted: 0,
        totalLearningHours: 0,
      };
    }

    const user = await User.create(userData);

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      token,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    // Find user by email
    const user = await User.findOne({ email: input.email.toLowerCase() });

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Your account has been deactivated',
      });
    }

    if (user.isSuspended) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Your account has been suspended',
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(input.password, user.password);

    if (!isPasswordValid) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      token,
    };
  }

  async getMe(userId: string) {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return { success: true, message: 'Password changed successfully' };
  }
}

export const authService = new AuthService();
