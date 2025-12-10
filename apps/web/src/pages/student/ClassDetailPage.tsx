import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  BookOpen,
  Clock,
  DollarSign,
  CheckCircle2,
  ArrowLeft,
  PlayCircle,
  Users,
  BarChart3,
} from 'lucide-react';

export function ClassDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const { data: classData, isLoading } = trpc.class.getById.useQuery(
    { slug: slug! },
    { enabled: !!slug }
  );

  const enrollMutation = trpc.enrollment.enroll.useMutation({
    onSuccess: () => {
      toast.success('Successfully enrolled in class!');
      navigate('/student/my-classes');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to enroll in class');
    },
  });

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/classes/${slug}` } });
      return;
    }

    if (classData) {
      enrollMutation.mutate({ classId: classData._id });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <MainLayout user={null}>
        <div className="container py-8 space-y-8">
          <Skeleton className="h-8 w-32" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!classData) {
    return (
      <MainLayout user={null}>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Class not found</h1>
          <Button asChild>
            <Link to="/classes">Browse Classes</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const isEnrolled = classData.isEnrolled;

  return (
    <MainLayout
      user={
        isAuthenticated && user
          ? {
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: user.role,
            }
          : null
      }
    >
      <div className="container py-8 space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link to="/classes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Classes
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thumbnail */}
            {classData.thumbnail ? (
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={classData.thumbnail}
                  alt={classData.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <PlayCircle className="h-24 w-24 text-muted-foreground" />
              </div>
            )}

            {/* Title and Badges */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{classData.category}</Badge>
                <Badge>{classData.level}</Badge>
              </div>
              <h1 className="text-4xl font-bold">{classData.title}</h1>
              <p className="text-lg text-muted-foreground">
                {classData.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{classData.totalLessons} lessons</span>
              </div>
              {classData.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{classData.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{classData.enrolledCount || 0} students</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span>{classData.level}</span>
              </div>
            </div>

            <Separator />

            {/* What You'll Learn */}
            {classData.whatYoullLearn && classData.whatYoullLearn.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>What you'll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {classData.whatYoullLearn.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {classData.requirements && classData.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {classData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Curriculum Preview */}
            {classData.modules && classData.modules.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Curriculum</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {classData.modules.map((module: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-semibold">
                        Module {index + 1}: {module.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {module.lessonsCount || 0} lessons
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      ${classData.monthlyFee}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {classData.platformFee && (
                    <p className="text-xs text-muted-foreground">
                      +${classData.platformFee} platform fee
                    </p>
                  )}
                </div>

                {isEnrolled ? (
                  <Button className="w-full" asChild>
                    <Link to={`/student/class/${classData._id}/lessons`}>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Go to Class
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleEnroll}
                    disabled={enrollMutation.isLoading}
                  >
                    {enrollMutation.isLoading ? 'Enrolling...' : 'Enroll Now'}
                  </Button>
                )}

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Lessons</span>
                    <span className="font-medium">{classData.totalLessons}</span>
                  </div>
                  {classData.duration && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{classData.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{classData.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Access</span>
                    <span className="font-medium">Lifetime</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Instructor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={classData.teacher.avatar}
                      alt={`${classData.teacher.firstName} ${classData.teacher.lastName}`}
                    />
                    <AvatarFallback>
                      {getInitials(
                        classData.teacher.firstName,
                        classData.teacher.lastName
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {classData.teacher.firstName} {classData.teacher.lastName}
                    </p>
                    {classData.teacher.headline && (
                      <p className="text-sm text-muted-foreground">
                        {classData.teacher.headline}
                      </p>
                    )}
                  </div>
                </div>
                {classData.teacher.bio && (
                  <p className="text-sm text-muted-foreground">
                    {classData.teacher.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
