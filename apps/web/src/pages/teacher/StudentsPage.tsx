import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, GraduationCap } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function StudentsPage() {
  const [selectedClass, setSelectedClass] = useState<string>('all');

  const { data: classes, isLoading: classesLoading } = trpc.class.getMyClasses.useQuery() as any;

  if (classesLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Calculate total students across all classes
  const totalStudents = (classes as any[])?.reduce((acc, cls) => acc + (cls.enrollmentCount || 0), 0) || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">View and manage your enrolled students</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(classes as any[])?.filter((c) => c.status === 'published').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {(classes as any[])?.length || 0} total classes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter by Class */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Enrollment Overview</CardTitle>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {(classes as any[])?.map((cls) => (
                  <SelectItem key={cls._id.toString()} value={cls._id.toString()}>
                    {cls.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {!classes || classes.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No classes yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a class to start teaching students.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Monthly Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(classes as any[])
                  ?.filter((cls) =>
                    selectedClass === 'all' ? true : cls._id.toString() === selectedClass
                  )
                  .map((cls) => (
                    <TableRow key={cls._id.toString()}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {cls.title.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{cls.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {cls.shortDescription || cls.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{cls.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{cls.level}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{cls.enrollmentCount || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={cls.status === 'published' ? 'default' : 'secondary'}>
                          {cls.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${cls.monthlyFee.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Detailed student progress tracking and individual student views
            are coming soon. For now, you can see the total number of students enrolled in each of
            your classes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
