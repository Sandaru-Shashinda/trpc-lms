import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, PlayCircle, Clock, AlertCircle } from 'lucide-react';

interface EnrollmentCardProps {
  enrollment: {
    _id: string;
    class: {
      _id: string;
      slug: string;
      title: string;
      thumbnail?: string;
      category: string;
      totalLessons: number;
    };
    progress: {
      completedLessons: number;
      totalLessons: number;
      percentage: number;
      lastAccessedLesson?: {
        _id: string;
        title: string;
      };
    };
    paymentStatus: 'active' | 'pending' | 'overdue';
    nextPaymentDue?: Date;
  };
}

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const { class: classInfo, progress, paymentStatus, nextPaymentDue } = enrollment;

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {classInfo.thumbnail ? (
          <img
            src={classInfo.thumbnail}
            alt={classInfo.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <BookOpen className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary">{classInfo.category}</Badge>
        </div>
      </div>

      <CardHeader className="space-y-2">
        <h3 className="text-lg font-semibold line-clamp-2">{classInfo.title}</h3>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress.percentage}%</span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {progress.completedLessons} of {progress.totalLessons} lessons completed
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Last Accessed */}
        {progress.lastAccessedLesson && (
          <div className="flex items-start gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs">Continue from:</p>
              <p className="font-medium line-clamp-1">
                {progress.lastAccessedLesson.title}
              </p>
            </div>
          </div>
        )}

        {/* Payment Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={getPaymentStatusColor(paymentStatus)}>
              {paymentStatus}
            </Badge>
            {paymentStatus === 'overdue' && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
          </div>
          {nextPaymentDue && paymentStatus !== 'overdue' && (
            <span className="text-xs text-muted-foreground">
              Due: {new Date(nextPaymentDue).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1">
          <Link to={`/student/class/${classInfo._id}/lessons`}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Continue Learning
          </Link>
        </Button>
        {paymentStatus === 'overdue' && (
          <Button asChild variant="destructive" className="flex-1">
            <Link to="/student/payments">Pay Now</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
