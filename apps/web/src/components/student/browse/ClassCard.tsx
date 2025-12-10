import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Clock, DollarSign } from 'lucide-react';

interface ClassCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  thumbnail?: string;
  teacher: {
    name: string;
    avatar?: string;
  };
  monthlyFee: number;
  totalLessons: number;
  duration?: string;
}

export function ClassCard({
  id,
  slug,
  title,
  description,
  category,
  level,
  thumbnail,
  teacher,
  monthlyFee,
  totalLessons,
  duration,
}: ClassCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Link to={`/classes/${slug}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <BookOpen className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge className={getLevelColor(level)}>{level}</Badge>
          </div>
        </div>

        <CardHeader className="space-y-2">
          {/* Category */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            {duration && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {duration}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight group-hover:text-primary">
            {title}
          </h3>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Teacher Info */}
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={teacher.avatar} alt={teacher.name} />
              <AvatarFallback className="text-xs">
                {getInitials(teacher.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {teacher.name}
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t pt-4">
          {/* Lessons Count */}
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="mr-2 h-4 w-4" />
            {totalLessons} lesson{totalLessons !== 1 ? 's' : ''}
          </div>

          {/* Price */}
          <div className="flex items-center font-semibold">
            <DollarSign className="h-4 w-4" />
            {monthlyFee}
            <span className="text-sm font-normal text-muted-foreground">
              /mo
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
