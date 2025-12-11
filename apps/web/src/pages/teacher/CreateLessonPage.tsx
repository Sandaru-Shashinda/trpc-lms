import { useNavigate, useParams, Link } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { LessonForm } from '@/components/teacher/lesson/LessonForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

export function CreateLessonPage() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: classData, isLoading } = trpc.class.getById.useQuery(
    { classId: classId! },
    { enabled: !!classId }
  );

  const createMutation = trpc.lesson.create.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Lesson created successfully',
      });
      navigate(`/teacher/classes/${classId}/lessons`);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-16 text-center">
            <h3 className="text-lg font-semibold">Class not found</h3>
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
      <Link to={`/teacher/classes/${classId}/lessons`}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lessons
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Lesson</h1>
        <p className="text-muted-foreground">
          Add a new lesson to <span className="font-semibold">{classData.title}</span>
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <LessonForm
            onSubmit={(data) =>
              createMutation.mutate({
                classId: classId!,
                ...data,
              })
            }
            isLoading={createMutation.isPending}
            submitLabel="Create Lesson"
          />
        </CardContent>
      </Card>
    </div>
  );
}
