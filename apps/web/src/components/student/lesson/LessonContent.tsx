import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';

interface LessonContentProps {
  title: string;
  description?: string;
  duration?: string;
  monthNumber: number;
}

export function LessonContent({
  title,
  description,
  duration,
  monthNumber,
}: LessonContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <Badge variant="secondary" className="flex-shrink-0">
          Month {monthNumber}
        </Badge>
      </div>

      {duration && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Month {monthNumber}</span>
          </div>
        </div>
      )}
    </div>
  );
}
