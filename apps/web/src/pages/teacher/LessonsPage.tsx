import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Plus, Edit, Trash2, Video, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LessonsPage() {
  const { classId } = useParams<{ classId: string }>();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);

  const { data: classData, isLoading: classLoading } = trpc.class.getById.useQuery(
    { classId: classId! },
    { enabled: !!classId }
  ) as any;

  const { data: lessons, isLoading: lessonsLoading, refetch } = trpc.lesson.getClassLessons.useQuery(
    { classId: classId! },
    { enabled: !!classId }
  ) as any;

  const deleteMutation = trpc.lesson.delete.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Lesson deleted successfully',
      });
      refetch();
      setDeleteDialogOpen(false);
      setLessonToDelete(null);
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
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleDeleteClick = (lessonId: string) => {
    setLessonToDelete(lessonId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (lessonToDelete) {
      deleteMutation.mutate({ lessonId: lessonToDelete });
    }
  };

  const handlePublish = (lessonId: string) => {
    publishMutation.mutate({ lessonId });
  };

  if (classLoading || lessonsLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
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

  // Group lessons by month
  const lessonsByMonth = (lessons as any[])?.reduce((acc, lesson) => {
    const month = lesson.monthNumber;
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(lesson);
    return acc;
  }, {} as Record<number, typeof lessons>);

  const sortedMonths = Object.keys(lessonsByMonth || {})
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
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
          <h1 className="text-3xl font-bold tracking-tight">{classData.title}</h1>
          <p className="text-muted-foreground">Manage lessons for this class</p>
        </div>
        <Link to={`/teacher/classes/${classId}/lessons/create`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Lesson
          </Button>
        </Link>
      </div>

      {/* Lessons by Month */}
      {!lessons || lessons.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Video className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No lessons yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Start adding lessons to your class. Students will be able to access them based on
              their payment status.
            </p>
            <Link to={`/teacher/classes/${classId}/lessons/create`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Lesson
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {sortedMonths.map((month) => (
            <Card key={month}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Month {month}
                  <Badge variant="outline">{lessonsByMonth?.[month]?.length || 0} lessons</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lessonsByMonth?.[month]?.map((lesson: any) => (
                  <div
                    key={lesson._id.toString()}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {lesson.contentType === 'video' ? (
                        <Video className="h-8 w-8 text-blue-600" />
                      ) : (
                        <FileText className="h-8 w-8 text-green-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{lesson.title}</h3>
                        <Badge variant={lesson.status === 'published' ? 'default' : 'secondary'}>
                          {lesson.status}
                        </Badge>
                        {lesson.isFree && <Badge variant="outline">Free</Badge>}
                      </div>
                      {lesson.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {lesson.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {lesson.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePublish(lesson._id.toString())}
                          disabled={publishMutation.isPending}
                        >
                          Publish
                        </Button>
                      )}
                      <Link to={`/teacher/lessons/${lesson._id.toString()}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(lesson._id.toString())}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lesson</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lesson? This action cannot be undone. Student
              progress for this lesson will also be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
