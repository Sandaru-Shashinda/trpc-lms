import { useNavigate } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { ClassForm } from '@/components/teacher/class/ClassForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function CreateClassPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const createMutation = trpc.class.create.useMutation({
    onSuccess: (data: any) => {
      toast({
        title: 'Success',
        description: 'Class created successfully',
      });
      navigate(`/teacher/classes/${(data as any)._id.toString()}/edit`);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Class</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create a new class. You can add lessons after creating the
          class.
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ClassForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending}
            submitLabel="Create Class"
          />
        </CardContent>
      </Card>
    </div>
  );
}
