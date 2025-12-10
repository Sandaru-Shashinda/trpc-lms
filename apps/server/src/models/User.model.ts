import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  firstName: string;
  lastName: string;
  profilePicture?: string;
  phone?: string;
  dateOfBirth?: Date;

  // Address
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };

  // Profile
  bio?: string;
  headline?: string;

  // Teacher Profile
  teacherProfile?: {
    expertise: string[];
    experience?: number;
    education?: Array<{
      degree: string;
      institution: string;
      year: number;
    }>;
    totalStudents: number;
    totalClasses: number;
    isApproved: boolean;
    approvedAt?: Date;
    bankDetails?: {
      accountNumber: string;
      accountHolderName: string;
      bankName: string;
      ifscCode: string;
    };
  };

  // Student Profile
  studentProfile?: {
    enrolledClasses: mongoose.Types.ObjectId[];
    interests: string[];
    totalCoursesCompleted: number;
    totalLearningHours: number;
  };

  // Settings
  settings: {
    emailNotifications: boolean;
    language: string;
  };

  // Account Status
  isActive: boolean;
  isEmailVerified: boolean;
  isSuspended: boolean;

  // Authentication
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePicture: String,
    phone: String,
    dateOfBirth: Date,

    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },

    bio: String,
    headline: String,

    teacherProfile: {
      expertise: [String],
      experience: Number,
      education: [
        {
          degree: String,
          institution: String,
          year: Number,
        },
      ],
      totalStudents: { type: Number, default: 0 },
      totalClasses: { type: Number, default: 0 },
      isApproved: { type: Boolean, default: false },
      approvedAt: Date,
      bankDetails: {
        accountNumber: String,
        accountHolderName: String,
        bankName: String,
        ifscCode: String,
      },
    },

    studentProfile: {
      enrolledClasses: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
      interests: [String],
      totalCoursesCompleted: { type: Number, default: 0 },
      totalLearningHours: { type: Number, default: 0 },
    },

    settings: {
      emailNotifications: { type: Boolean, default: true },
      language: { type: String, default: 'en' },
    },

    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },

    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'teacherProfile.isApproved': 1 });

export const User = mongoose.model<IUser>('User', userSchema);
