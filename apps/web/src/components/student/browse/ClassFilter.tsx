import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

interface ClassFilterProps {
  category?: string;
  level?: string;
  onCategoryChange: (category: string | undefined) => void;
  onLevelChange: (level: string | undefined) => void;
  onClearFilters: () => void;
}

const categories = [
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Photography',
  'Music',
  'Language',
  'Health & Fitness',
  'Personal Development',
];

const levels = ['Beginner', 'Intermediate', 'Advanced'];

export function ClassFilter({
  category,
  level,
  onCategoryChange,
  onLevelChange,
  onClearFilters,
}: ClassFilterProps) {
  const hasActiveFilters = category || level;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-[200px]">
        <Select
          value={category || 'all'}
          onValueChange={(value) =>
            onCategoryChange(value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <Select
          value={level || 'all'}
          onValueChange={(value) =>
            onLevelChange(value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {levels.map((lvl) => (
              <SelectItem key={lvl} value={lvl}>
                {lvl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="whitespace-nowrap"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
