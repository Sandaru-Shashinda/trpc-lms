import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnrollmentCard } from '@/components/student/enrollment/EnrollmentCard';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/trpc';
import { BookOpen, ArrowRight } from 'lucide-react';

export function MyClassesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'completed'>('all');

  const { data: enrollments, isLoading } = trpc.enrollment.getMyEnrollments.useQuery();

  // Filter enrollments based on tab
  const filteredEnrollments = enrollments?.filter((enrollment) => {
    if (activeTab === 'in-progress') {
      return enrollment.progress.percentage < 100;
    }
    if (activeTab === 'completed') {
      return enrollment.progress.percentage === 100;
    }
    return true; // 'all' tab
  });

  const inProgressCount = enrollments?.filter(e => e.progress.percentage < 100).length || 0;
  const completedCount = enrollments?.filter(e => e.progress.percentage === 100).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Classes</h1>
        <p className="text-muted-foreground">
          Manage and continue your enrolled classes
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'in-progress' | 'completed')}>
        <TabsList>
          <TabsTrigger value="all">
            All ({enrollments?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressCount})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredEnrollments && filteredEnrollments.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEnrollments.map((enrollment) => (
                <EnrollmentCard key={enrollment._id} enrollment={enrollment} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {activeTab === 'completed'
                  ? 'No completed classes yet'
                  : activeTab === 'in-progress'
                  ? 'No classes in progress'
                  : 'No enrolled classes'}
              </h3>
              <p className="text-muted-foreground max-w-md mb-4">
                {activeTab === 'completed'
                  ? 'Complete your ongoing classes to see them here.'
                  : 'Browse our catalog and enroll in classes to start learning!'}
              </p>
              {activeTab !== 'completed' && (
                <Button asChild>
                  <Link to="/classes">
                    Browse Classes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
