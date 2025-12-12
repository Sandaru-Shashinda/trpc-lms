import { useParams, Link } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { ClassForm } from '@/components/teacher/class/ClassForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, BookOpen, Eye } from 'lucide-react';

export function EditClassPage() {
  const { classId } = useParams<{ classId: string }>();
  const { toast } = useToast();

  const { data: classData, isLoading } = trpc.class.getById.useQuery(
    { classId: classId! },
    { enabled: !!classId }
  ) as any;

  const updateMutation = trpc.class.update.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Class updated successfully',
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

  const publishMutation = trpc.class.publish.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Class published successfully',
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
    if (classId) {
      publishMutation.mutate({ classId });
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

  if (!classData) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-16 text-center">
            <h3 className="text-lg font-semibold">Class not found</h3>
            <p className="text-muted-foreground mt-2">
              The class you're looking for doesn't exist or you don't have permission to edit it.
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
      <Link to="/teacher/classes">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Classes
        </Button>
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Edit Class</h1>
            <Badge variant={classData.status === 'published' ? 'default' : 'secondary'}>
              {classData.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">Update your class details and settings</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/teacher/classes/${classId}/lessons`}>
            <Button variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Manage Lessons
            </Button>
          </Link>
          {classData.status === 'draft' && (
            <Button onClick={handlePublish} disabled={publishMutation.isPending}>
              <Eye className="mr-2 h-4 w-4" />
              {publishMutation.isPending ? 'Publishing...' : 'Publish Class'}
            </Button>
          )}
        </div>
      </div>

      {/* Status Info */}
      {classData.status === 'draft' && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">
              <strong>Draft Mode:</strong> This class is not visible to students yet. Add some
              lessons and publish it when you're ready.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ClassForm
            defaultValues={{
              title: classData.title,
              description: classData.description,
              shortDescription: classData.shortDescription,
              category: classData.category,
              level: classData.level,
              monthlyFee: classData.monthlyFee,
              requirements: classData.requirements,
              whatYouWillLearn: classData.whatYouWillLearn,
            }}
            onSubmit={(data) =>
              updateMutation.mutate({
                classId: classId!,
                ...data,
              })
            }
            isLoading={updateMutation.isPending}
            submitLabel="Update Class"
          />
        </CardContent>
      </Card>
    </div>
  );
}
