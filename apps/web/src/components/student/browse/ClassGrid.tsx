import { ClassCard } from './ClassCard';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';

interface Class {
  _id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  thumbnail?: string;
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  monthlyFee: number;
  totalLessons: number;
  duration?: string;
}

interface ClassGridProps {
  classes: Class[];
  isLoading?: boolean;
}

export function ClassGrid({ classes, isLoading }: ClassGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <BookOpen className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No classes found</h3>
        <p className="text-muted-foreground max-w-md">
          We couldn't find any classes matching your criteria. Try adjusting
          your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {classes.map((classItem) => (
        <ClassCard
          key={classItem._id}
          id={classItem._id}
          slug={classItem.slug}
          title={classItem.title}
          description={classItem.description}
          category={classItem.category}
          level={classItem.level}
          thumbnail={classItem.thumbnail}
          teacher={{
            name: `${classItem.teacher.firstName} ${classItem.teacher.lastName}`,
            avatar: classItem.teacher.avatar,
          }}
          monthlyFee={classItem.monthlyFee}
          totalLessons={classItem.totalLessons}
          duration={classItem.duration}
        />
      ))}
    </div>
  );
}
