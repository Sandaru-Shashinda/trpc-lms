import { Lesson, ILesson } from '../models/Lesson.model';
import { Class } from '../models/Class.model';
import { Enrollment } from '../models/Enrollment.model';
import { TRPCError } from '@trpc/server';
import { generateSlug } from '../utils/slug.utils';
import {
  extractYouTubeVideoId,
  isValidYouTubeUrl,
  getYouTubeThumbnail,
} from '../utils/youtube.utils';
import mongoose from 'mongoose';

interface CreateLessonInput {
  classId: string;
  title: string;
  description?: string;
  contentType: 'video' | 'document' | 'text';
  videoUrl?: string;
  documentUrl?: string;
  textContent?: string;
  monthNumber: number;
  isFree?: boolean;
  resources?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
}

interface UpdateLessonInput extends Partial<CreateLessonInput> {
  lessonId: string;
}

export class LessonService {
  async createLesson(teacherId: string, input: CreateLessonInput) {
    // Verify class ownership
    const classData = await Class.findById(input.classId);

    if (!classData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Class not found',
      });
    }

    if (classData.teacherId.toString() !== teacherId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You can only create lessons for your own classes',
      });
    }

    // Validate YouTube URL if video content
    let videoId: string | undefined;
    let videoThumbnail: string | undefined;

    if (input.contentType === 'video' && input.videoUrl) {
      if (!isValidYouTubeUrl(input.videoUrl)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid YouTube URL',
        });
      }

      videoId = extractYouTubeVideoId(input.videoUrl) || undefined;
      if (videoId) {
        videoThumbnail = getYouTubeThumbnail(videoId);
      }
    }

    // Generate slug
    const baseSlug = generateSlug(input.title);
    let slug = baseSlug;
    let counter = 1;

    while (await Lesson.findOne({ slug, classId: input.classId })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Get next order number
    const lastLesson = await Lesson.findOne({ classId: input.classId })
      .sort({ order: -1 });
    const order = lastLesson ? lastLesson.order + 1 : 1;

    // Create lesson
    const lesson = await Lesson.create({
      classId: new mongoose.Types.ObjectId(input.classId),
      teacherId: new mongoose.Types.ObjectId(teacherId),
      title: input.title,
      slug,
      description: input.description,
      order,
      contentType: input.contentType,
      videoUrl: input.videoUrl,
      videoId,
      videoThumbnail,
      documentUrl: input.documentUrl,
      textContent: input.textContent,
      monthNumber: input.monthNumber,
      isFree: input.isFree || false,
      resources: input.resources || [],
      status: 'draft',
    });

    // Update class total lessons
    classData.totalLessons += 1;
    await classData.save();

    return lesson;
  }

  async updateLesson(teacherId: string, input: UpdateLessonInput) {
    const lesson = await Lesson.findById(input.lessonId);

    if (!lesson) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Lesson not found',
      });
    }

    if (lesson.teacherId.toString() !== teacherId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You can only update your own lessons',
      });
    }

    const updateData: any = {};

    if (input.title) {
      updateData.title = input.title;
      // Regenerate slug
      const baseSlug = generateSlug(input.title);
      let slug = baseSlug;
      let counter = 1;

      while (await Lesson.findOne({
        slug,
        classId: lesson.classId,
        _id: { $ne: input.lessonId }
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    if (input.description) updateData.description = input.description;
    if (input.monthNumber !== undefined) updateData.monthNumber = input.monthNumber;
    if (input.isFree !== undefined) updateData.isFree = input.isFree;
    if (input.resources) updateData.resources = input.resources;

    // Handle video URL update
    if (input.videoUrl) {
      if (!isValidYouTubeUrl(input.videoUrl)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid YouTube URL',
        });
      }

      const videoId = extractYouTubeVideoId(input.videoUrl);
      updateData.videoUrl = input.videoUrl;
      updateData.videoId = videoId;
      updateData.videoThumbnail = videoId ? getYouTubeThumbnail(videoId) : undefined;
    }

    if (input.textContent) updateData.textContent = input.textContent;
    if (input.documentUrl) updateData.documentUrl = input.documentUrl;

    const updatedLesson = await Lesson.findByIdAndUpdate(
      input.lessonId,
      { $set: updateData },
      { new: true }
    );

    return updatedLesson;
  }

  async publishLesson(teacherId: string, lessonId: string) {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Lesson not found',
      });
    }

    if (lesson.teacherId.toString() !== teacherId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You can only publish your own lessons',
      });
    }

    lesson.status = 'published';
    lesson.publishedAt = new Date();
    await lesson.save();

    return lesson;
  }

  async getClassLessons(classId: string, userId?: string) {
    const lessons = await Lesson.find({ classId, status: 'published' })
      .sort({ order: 1 });

    // If user is provided, check access for each lesson
    if (userId) {
      const enrollment = await Enrollment.findOne({
        studentId: userId,
        classId,
        status: 'active',
      });

      return lessons.map((lesson) => {
        const hasAccess =
          lesson.isFree ||
          (enrollment && enrollment.unlockedMonths.includes(lesson.monthNumber));

        return {
          ...lesson.toObject(),
          hasAccess,
        };
      });
    }

    return lessons;
  }

  async getLessonById(lessonId: string, userId?: string) {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Lesson not found',
      });
    }

    // Check access if user is provided
    if (userId) {
      const enrollment = await Enrollment.findOne({
        studentId: userId,
        classId: lesson.classId,
        status: 'active',
      });

      const hasAccess =
        lesson.isFree ||
        (enrollment && enrollment.unlockedMonths.includes(lesson.monthNumber));

      if (!hasAccess) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You need to pay for this month to access this lesson',
        });
      }
    }

    return lesson;
  }

  async deleteLesson(teacherId: string, lessonId: string) {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Lesson not found',
      });
    }

    if (lesson.teacherId.toString() !== teacherId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You can only delete your own lessons',
      });
    }

    await Lesson.findByIdAndDelete(lessonId);

    // Update class total lessons
    const classData = await Class.findById(lesson.classId);
    if (classData) {
      classData.totalLessons = Math.max(0, classData.totalLessons - 1);
      await classData.save();
    }

    return { success: true };
  }
}

export const lessonService = new LessonService();
