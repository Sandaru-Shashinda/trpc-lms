import { useParams } from 'react-router-dom';
import { YouTubePlayer } from '@/components/student/lesson/YouTubePlayer';
import { LessonContent } from '@/components/student/lesson/LessonContent';
import { LessonNavigation } from '@/components/student/lesson/LessonNavigation';
import { LessonResources } from '@/components/student/lesson/LessonResources';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function LessonViewPage() {
  const { classId, lessonId } = useParams<{ classId: string; lessonId: string }>();
  const [isMarking, setIsMarking] = useState(false);

  // Fetch lesson data
  const { data: lesson, isLoading } = trpc.lesson.getById.useQuery(
    { lessonId: lessonId! },
    { enabled: !!lessonId }
  );

  // Fetch access status
  const { data: accessData } = trpc.enrollment.checkAccess.useQuery(
    { classId: classId!, month: lesson?.monthNumber || 1 },
    { enabled: !!classId && !!lesson }
  );

  // Update progress mutation
  const updateProgressMutation = trpc.enrollment.updateProgress.useMutation({
    onSuccess: () => {
      toast.success('Progress saved');
    },
  });

  // Mark as complete mutation
  const markCompleteMutation = trpc.enrollment.markLessonComplete.useMutation({
    onSuccess: () => {
      toast.success('Lesson marked as complete! 🎉');
      setIsMarking(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to mark lesson as complete');
      setIsMarking(false);
    },
  });

  const handleProgress = (position: number) => {
    if (!classId || !lessonId) return;

    updateProgressMutation.mutate({
      classId,
      lessonId,
      watchPosition: position,
    });
  };

  const handleComplete = () => {
    if (!classId || !lessonId || isMarking) return;

    setIsMarking(true);
    markCompleteMutation.mutate({
      classId,
      lessonId,
    });
  };

  const handleMarkComplete = () => {
    handleComplete();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-2">Lesson not found</h2>
        <p className="text-muted-foreground">
          The lesson you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  const hasAccess = accessData?.hasAccess ?? false;
  const isCompleted = accessData?.isCompleted ?? false;

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <YouTubePlayer
        videoId={lesson.videoUrl}
        hasAccess={hasAccess}
        onProgress={handleProgress}
        onComplete={handleComplete}
        savedPosition={accessData?.watchPosition}
      />

      {/* Lesson Content */}
      <LessonContent
        title={lesson.title}
        description={lesson.description}
        duration={lesson.duration}
        monthNumber={lesson.monthNumber}
      />

      {/* Mark as Complete Button */}
      {hasAccess && !isCompleted && (
        <div className="flex items-center justify-center">
          <Button
            size="lg"
            onClick={handleMarkComplete}
            disabled={isMarking || markCompleteMutation.isLoading}
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            {isMarking ? 'Marking...' : 'Mark as Complete'}
          </Button>
        </div>
      )}

      {isCompleted && (
        <div className="flex items-center justify-center text-green-600 dark:text-green-400">
          <CheckCircle2 className="mr-2 h-5 w-5" />
          <span className="font-medium">Lesson Completed!</span>
        </div>
      )}

      <Separator />

      {/* Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <LessonResources resources={lesson.resources} />
      )}

      <Separator />

      {/* Navigation */}
      <LessonNavigation
        classId={classId!}
        previousLesson={lesson.previousLesson}
        nextLesson={lesson.nextLesson}
      />
    </div>
  );
}
