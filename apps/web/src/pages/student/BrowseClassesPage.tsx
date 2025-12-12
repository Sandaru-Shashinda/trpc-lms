import { useState, useCallback } from 'react';
import { MainLayout } from '@/components/layout';
import { SearchBar } from '@/components/shared/SearchBar';
import { ClassFilter } from '@/components/student/browse/ClassFilter';
import { ClassGrid } from '@/components/student/browse/ClassGrid';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export function BrowseClassesPage() {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [level, setLevel] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  // Fetch classes with filters (backend returns full array, no pagination)
  const { data: classes, isLoading } = trpc.class.getPublished.useQuery({
    search: searchQuery || undefined,
    category,
    level,
  }) as any;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on search
  }, []);

  const handleCategoryChange = useCallback((newCategory: string | undefined) => {
    setCategory(newCategory);
    setPage(1);
  }, []);

  const handleLevelChange = useCallback((newLevel: string | undefined) => {
    setLevel(newLevel);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setCategory(undefined);
    setLevel(undefined);
    setSearchQuery('');
    setPage(1);
  }, []);

  // Handle client-side pagination
  const allClasses = (Array.isArray(classes) ? classes : []) as any[];
  const totalPages = Math.ceil(allClasses.length / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const paginatedClasses = allClasses.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

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
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Browse Classes</h1>
          <p className="text-muted-foreground text-lg">
            Discover classes from expert instructors around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search for classes..."
            defaultValue={searchQuery}
          />
          <ClassFilter
            category={category}
            level={level}
            onCategoryChange={handleCategoryChange}
            onLevelChange={handleLevelChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Results Count */}
        {!isLoading && allClasses.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {allClasses.length} {allClasses.length === 1 ? 'class' : 'classes'} found
          </div>
        )}

        {/* Classes Grid */}
        <ClassGrid classes={paginatedClasses} isLoading={isLoading} />

        {/* Pagination */}
        {!isLoading && allClasses.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(p)}
                  className="min-w-[2.5rem]"
                >
                  {p}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={!hasNextPage}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
