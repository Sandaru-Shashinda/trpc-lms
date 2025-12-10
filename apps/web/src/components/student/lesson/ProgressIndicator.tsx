import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';

interface ProgressIndicatorProps {
  completedLessons: number;
  totalLessons: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ProgressIndicator({
  completedLessons,
  totalLessons,
  size = 'md',
  showLabel = true,
}: ProgressIndicatorProps) {
  const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className={`flex items-center justify-between ${textSizeClasses[size]}`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="font-medium">Progress</span>
          </div>
          <span className="font-semibold">{percentage}%</span>
        </div>
      )}
      <Progress value={percentage} className={sizeClasses[size]} />
      {showLabel && (
        <p className={`text-muted-foreground ${textSizeClasses[size]}`}>
          {completedLessons} of {totalLessons} lessons completed
        </p>
      )}
    </div>
  );
}
