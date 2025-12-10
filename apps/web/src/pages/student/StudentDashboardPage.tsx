import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnrollmentCard } from '@/components/student/enrollment/EnrollmentCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import {
  BookOpen,
  GraduationCap,
  TrendingUp,
  Calendar,
  ArrowRight,
} from 'lucide-react';

export function StudentDashboardPage() {
  const { user } = useAuth();

  // Fetch enrollments
  const { data: enrollments, isLoading } = trpc.enrollment.getMyEnrollments.useQuery();

  // Calculate stats
  const totalClasses = enrollments?.length || 0;
  const activeClasses = enrollments?.filter(e => e.paymentStatus === 'active').length || 0;
  const totalProgress = enrollments?.reduce((acc, e) => acc + e.progress.percentage, 0) || 0;
  const avgProgress = totalClasses > 0 ? Math.round(totalProgress / totalClasses) : 0;

  // Get classes to continue (with progress < 100%)
  const continueLearning = enrollments
    ?.filter(e => e.progress.percentage < 100)
    ?.slice(0, 3) || [];

  // Get upcoming payments (overdue or due soon)
  const upcomingPayments = enrollments
    ?.filter(e => e.paymentStatus === 'overdue' || e.paymentStatus === 'pending')
    ?.slice(0, 3) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your learning journey
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Enrolled Classes
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              {activeClasses} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress}%</div>
            <p className="text-xs text-muted-foreground">
              Across all classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrollments?.reduce((acc, e) => acc + e.progress.completedLessons, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Lessons completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Section */}
      {continueLearning.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Continue Learning</h2>
            <Button variant="ghost" asChild>
              <Link to="/student/my-classes">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {continueLearning.map((enrollment) => (
                <EnrollmentCard key={enrollment._id} enrollment={enrollment} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upcoming Payments Alert */}
      {upcomingPayments.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingPayments.map((enrollment) => (
              <div
                key={enrollment._id}
                className="flex items-center justify-between p-3 bg-background rounded-lg"
              >
                <div>
                  <p className="font-medium">{enrollment.class.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Status: {enrollment.paymentStatus}
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link to="/student/payments">Pay Now</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && totalClasses === 0 && (
        <Card className="p-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-muted p-6">
              <GraduationCap className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Start Your Learning Journey
              </h3>
              <p className="text-muted-foreground max-w-md">
                You haven't enrolled in any classes yet. Browse our catalog to
                find courses that interest you!
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/classes">
                Browse Classes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
