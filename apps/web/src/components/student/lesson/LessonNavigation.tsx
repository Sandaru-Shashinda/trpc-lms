import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';

interface LessonNavigationProps {
  classId: string;
  previousLesson?: {
    _id: string;
    title: string;
  } | null;
  nextLesson?: {
    _id: string;
    title: string;
  } | null;
}

export function LessonNavigation({
  classId,
  previousLesson,
  nextLesson,
}: LessonNavigationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      {/* Previous Lesson */}
      {previousLesson ? (
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/student/class/${classId}/lesson/${previousLesson._id}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            <div className="text-left flex-1">
              <div className="text-xs text-muted-foreground">Previous</div>
              <div className="font-medium truncate">{previousLesson.title}</div>
            </div>
          </Link>
        </Button>
      ) : (
        <div className="flex-1" />
      )}

      {/* Back to Class */}
      <Button asChild variant="outline">
        <Link to={`/student/class/${classId}/lessons`}>
          <List className="mr-2 h-4 w-4" />
          All Lessons
        </Link>
      </Button>

      {/* Next Lesson */}
      {nextLesson ? (
        <Button asChild className="flex-1">
          <Link to={`/student/class/${classId}/lesson/${nextLesson._id}`}>
            <div className="text-right flex-1">
              <div className="text-xs opacity-80">Next</div>
              <div className="font-medium truncate">{nextLesson.title}</div>
            </div>
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
