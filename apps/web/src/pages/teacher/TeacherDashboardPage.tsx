import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Users, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function TeacherDashboardPage() {
  const { data: classes, isLoading: classesLoading } = trpc.class.getMyClasses.useQuery();
  const { data: earnings, isLoading: earningsLoading } = trpc.payment.getMyEarnings.useQuery();

  const totalClasses = classes?.length || 0;
  const publishedClasses = classes?.filter((c) => c.status === 'published').length || 0;
  const totalStudents = classes?.reduce((acc, c) => acc + (c.enrollmentCount || 0), 0) || 0;
  const totalEarnings = earnings?.totalEarnings || 0;

  const stats = [
    {
      title: 'Total Classes',
      value: totalClasses,
      icon: BookOpen,
      description: `${publishedClasses} published`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      description: 'Across all classes',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Earnings',
      value: `$${totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      description: 'All time',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Active Enrollments',
      value: totalStudents,
      icon: TrendingUp,
      description: 'Currently enrolled',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  if (classesLoading || earningsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
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
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your teaching activity.
          </p>
        </div>
        <Link to="/teacher/classes/create">
          <Button>Create New Class</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Classes */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Your Classes</CardTitle>
            <Link to="/teacher/classes">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!classes || classes.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No classes yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating your first class.
              </p>
              <Link to="/teacher/classes/create">
                <Button className="mt-4">Create Class</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {classes.slice(0, 5).map((cls) => (
                <div
                  key={cls._id.toString()}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{cls.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cls.category} • {cls.level}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {cls.enrollmentCount || 0} students
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${cls.monthlyFee}/month
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/teacher/classes/${cls._id.toString()}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Link to={`/teacher/classes/${cls._id.toString()}/lessons`}>
                        <Button variant="outline" size="sm">
                          Lessons
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/teacher/classes">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold">Manage Classes</h3>
              <p className="text-sm text-muted-foreground">
                View and edit your classes
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/teacher/students">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold">View Students</h3>
              <p className="text-sm text-muted-foreground">
                Track student progress
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/teacher/earnings">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <DollarSign className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold">View Earnings</h3>
              <p className="text-sm text-muted-foreground">
                Check your revenue
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
