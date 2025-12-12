import { useParams, Link } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { LessonForm } from '@/components/teacher/lesson/LessonForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye } from 'lucide-react';

export function EditLessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { toast } = useToast();

  const { data: lesson, isLoading } = trpc.lesson.getById.useQuery(
    { lessonId: lessonId! },
    { enabled: !!lessonId }
  ) as any;

  const updateMutation = trpc.lesson.update.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Lesson updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const publishMutation = trpc.lesson.publish.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Lesson published successfully',
      });
      window.location.reload();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handlePublish = () => {
    if (lessonId) {
      publishMutation.mutate({ lessonId });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-16 text-center">
            <h3 className="text-lg font-semibold">Lesson not found</h3>
            <p className="text-muted-foreground mt-2">
              The lesson you're looking for doesn't exist or you don't have permission to edit it.
            </p>
            <Link to="/teacher/classes">
              <Button className="mt-4">Back to Classes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link to={`/teacher/classes/${lesson.classId.toString()}/lessons`}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lessons
        </Button>
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Edit Lesson</h1>
            <Badge variant={lesson.status === 'published' ? 'default' : 'secondary'}>
              {lesson.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">Update your lesson details and content</p>
        </div>
        {lesson.status === 'draft' && (
          <Button onClick={handlePublish} disabled={publishMutation.isPending}>
            <Eye className="mr-2 h-4 w-4" />
            {publishMutation.isPending ? 'Publishing...' : 'Publish Lesson'}
          </Button>
        )}
      </div>

      {/* Status Info */}
      {lesson.status === 'draft' && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">
              <strong>Draft Mode:</strong> This lesson is not visible to students yet. Publish it
              when you're ready.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <LessonForm
            defaultValues={{
              title: lesson.title,
              description: lesson.description,
              contentType: lesson.contentType,
              videoUrl: lesson.videoUrl,
              monthNumber: lesson.monthNumber,
              isFree: lesson.isFree,
            }}
            onSubmit={(data) =>
              updateMutation.mutate({
                lessonId: lessonId!,
                ...data,
              })
            }
            isLoading={updateMutation.isPending}
            submitLabel="Update Lesson"
          />
        </CardContent>
      </Card>
    </div>
  );
}
