import { Discussion } from '../models/Discussion.model';
import { Class } from '../models/Class.model';
import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

export class DiscussionService {
  async createDiscussion(userId: string, data: {
    classId: string;
    lessonId?: string;
    title?: string;
    content: string;
    type?: 'question' | 'announcement';
  }) {
    // Verify class exists
    const classExists = await Class.findById(data.classId);
    if (!classExists) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Class not found',
      });
    }

    const discussion = await Discussion.create({
      authorId: new mongoose.Types.ObjectId(userId),
      classId: new mongoose.Types.ObjectId(data.classId),
      lessonId: data.lessonId ? new mongoose.Types.ObjectId(data.lessonId) : undefined,
      title: data.title,
      content: data.content,
      type: data.type || 'question',
      lastActivityAt: new Date(),
    });

    await discussion.populate('authorId', 'firstName lastName profilePicture role');

    return discussion;
  }

  async getClassDiscussions(classId: string) {
    const discussions = await Discussion.find({ classId })
      .populate('authorId', 'firstName lastName profilePicture role')
      .sort({ lastActivityAt: -1 });

    return discussions;
  }

  async getLessonDiscussions(lessonId: string) {
    const discussions = await Discussion.find({ lessonId })
      .populate('authorId', 'firstName lastName profilePicture role')
      .sort({ lastActivityAt: -1 });

    return discussions;
  }

  async getDiscussionById(discussionId: string) {
    const discussion = await Discussion.findById(discussionId)
      .populate('authorId', 'firstName lastName profilePicture role')
      .populate('replies.authorId', 'firstName lastName profilePicture role');

    if (!discussion) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Discussion not found',
      });
    }

    return discussion;
  }

  async addReply(userId: string, discussionId: string, content: string) {
    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Discussion not found',
      });
    }

    // Check if user is the teacher of the class
    const classData = await Class.findById(discussion.classId);
    const isTeacher = classData?.teacherId.toString() === userId;

    discussion.replies.push({
      replyId: new mongoose.Types.ObjectId(),
      authorId: new mongoose.Types.ObjectId(userId),
      content,
      isTeacherReply: isTeacher,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    discussion.replyCount = discussion.replies.length;
    discussion.lastActivityAt = new Date();

    await discussion.save();
    await discussion.populate('replies.authorId', 'firstName lastName profilePicture role');

    return discussion;
  }

  async markAsResolved(userId: string, discussionId: string) {
    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Discussion not found',
      });
    }

    // Verify user is the teacher of the class
    const classData = await Class.findById(discussion.classId);
    if (classData?.teacherId.toString() !== userId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only the teacher can mark discussions as resolved',
      });
    }

    discussion.isResolved = true;
    discussion.resolvedAt = new Date();
    await discussion.save();

    return discussion;
  }

  async deleteDiscussion(userId: string, discussionId: string) {
    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Discussion not found',
      });
    }

    // Only author or teacher can delete
    const classData = await Class.findById(discussion.classId);
    const isAuthor = discussion.authorId.toString() === userId;
    const isTeacher = classData?.teacherId.toString() === userId;

    if (!isAuthor && !isTeacher) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to delete this discussion',
      });
    }

    await discussion.deleteOne();

    return { success: true };
  }
}

export const discussionService = new DiscussionService();
