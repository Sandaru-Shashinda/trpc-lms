import { useState } from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { BookOpen, Edit, Trash2, Users, DollarSign, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ClassesPage() {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);

  const { data: classes, isLoading, refetch } = trpc.class.getMyClasses.useQuery();
  const deleteMutation = trpc.class.delete.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Class deleted successfully',
      });
      refetch();
      setDeleteDialogOpen(false);
      setClassToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleDeleteClick = (classId: string) => {
    setClassToDelete(classId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (classToDelete) {
      deleteMutation.mutate({ classId: classToDelete });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground">
            Manage your classes and track student enrollments
          </p>
        </div>
        <Link to="/teacher/classes/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Class
          </Button>
        </Link>
      </div>

      {/* Classes Grid */}
      {!classes || classes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No classes yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Create your first class to start teaching and earning. Share your knowledge with
              students around the world.
            </p>
            <Link to="/teacher/classes/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Class
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Card key={cls._id.toString()} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Title and Status */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2">{cls.title}</h3>
                    <Badge variant={cls.status === 'published' ? 'default' : 'secondary'}>
                      {cls.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {cls.shortDescription || cls.description}
                  </p>
                </div>

                {/* Category and Level */}
                <div className="flex gap-2">
                  <Badge variant="outline">{cls.category}</Badge>
                  <Badge variant="outline">{cls.level}</Badge>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{cls.enrollmentCount || 0} students</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>${cls.monthlyFee}/mo</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Link to={`/teacher/classes/${cls._id.toString()}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Link to={`/teacher/classes/${cls._id.toString()}/lessons`} className="flex-1">
                    <Button size="sm" className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Lessons
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(cls._id.toString())}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Class</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this class? This action cannot be undone. All lessons
              and enrollments associated with this class will also be deleted.
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
