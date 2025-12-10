import { Class, IClass } from '../models/Class.model';
import { User } from '../models/User.model';
import { TRPCError } from '@trpc/server';
import { generateSlug } from '../utils/slug.utils';
import mongoose from 'mongoose';

interface CreateClassInput {
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  monthlyFee: number;
  requirements?: string[];
  whatYouWillLearn?: string[];
}

interface UpdateClassInput extends Partial<CreateClassInput> {
  classId: string;
}

export class ClassService {
  async createClass(teacherId: string, input: CreateClassInput) {
    // Verify teacher exists and is approved
    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== 'teacher') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only teachers can create classes',
      });
    }

    // Generate unique slug
    const baseSlug = generateSlug(input.title);
    let slug = baseSlug;
    let counter = 1;

    while (await Class.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create class
    const classData = await Class.create({
      teacherId: new mongoose.Types.ObjectId(teacherId),
      title: input.title,
      slug,
      description: input.description,
      shortDescription: input.shortDescription,
      category: input.category,
      level: input.level,
      monthlyFee: input.monthlyFee,
      requirements: input.requirements || [],
      whatYouWillLearn: input.whatYouWillLearn || [],
      status: 'draft',
    });

    // Update teacher's total classes
    if (teacher.teacherProfile) {
      teacher.teacherProfile.totalClasses += 1;
      await teacher.save();
    }

    return classData;
  }

  async updateClass(teacherId: string, input: UpdateClassInput) {
    const classData = await Class.findById(input.classId);

    if (!classData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Class not found',
      });
    }

    // Verify ownership
    if (classData.teacherId.toString() !== teacherId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You can only update your own classes',
      });
    }

    // Update fields
    const updateData: any = {};

    if (input.title) {
      updateData.title = input.title;
      // Regenerate slug if title changed
      const baseSlug = generateSlug(input.title);
      let slug = baseSlug;
      let counter = 1;

      while (await Class.findOne({ slug, _id: { $ne: input.classId } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    if (input.description) updateData.description = input.description;
    if (input.shortDescription) updateData.shortDescription = input.shortDescription;
    if (input.category) updateData.category = input.category;
    if (input.level) updateData.level = input.level;
    if (input.monthlyFee !== undefined) updateData.monthlyFee = input.monthlyFee;
    if (input.requirements) updateData.requirements = input.requirements;
    if (input.whatYouWillLearn) updateData.whatYouWillLearn = input.whatYouWillLearn;

    const updatedClass = await Class.findByIdAndUpdate(
      input.classId,
      { $set: updateData },
      { new: true }
    );

    return updatedClass;
  }

  async publishClass(teacherId: string, classId: string) {
    const classData = await Class.findById(classId);

    if (!classData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Class not found',
      });
    }

    if (classData.teacherId.toString() !== teacherId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You can only publish your own classes',
      });
    }

    if (classData.totalLessons === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Cannot publish a class without lessons',
      });
    }

    classData.status = 'published';
    classData.publishedAt = new Date();
    await classData.save();

    return classData;
  }

  async getTeacherClasses(teacherId: string) {
    const classes = await Class.find({ teacherId }).sort({ createdAt: -1 });
    return classes;
  }

  async getClassById(classId: string) {
    const classData = await Class.findById(classId)
      .populate('teacherId', 'firstName lastName profilePicture teacherProfile');

    if (!classData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Class not found',
      });
    }

    return classData;
  }

  async getPublishedClasses(filters?: {
    category?: string;
    level?: string;
    search?: string;
  }) {
    const query: any = {
      status: 'published',
      isActive: true,
    };

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.level) {
      query.level = filters.level;
    }

    if (filters?.search) {
      query.$text = { $search: filters.search };
    }

    const classes = await Class.find(query)
      .populate('teacherId', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 });

    return classes;
  }

  async deleteClass(teacherId: string, classId: string) {
    const classData = await Class.findById(classId);

    if (!classData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Class not found',
      });
    }

    if (classData.teacherId.toString() !== teacherId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You can only delete your own classes',
      });
    }

    // Check if class has active enrollments
    if (classData.activeEnrollments > 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Cannot delete a class with active enrollments',
      });
    }

    await Class.findByIdAndDelete(classId);

    // Update teacher's total classes
    const teacher = await User.findById(teacherId);
    if (teacher && teacher.teacherProfile) {
      teacher.teacherProfile.totalClasses = Math.max(0, teacher.teacherProfile.totalClasses - 1);
      await teacher.save();
    }

    return { success: true };
  }
}

export const classService = new ClassService();
