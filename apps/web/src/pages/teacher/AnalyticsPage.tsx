import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/trpc';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, DollarSign, GraduationCap, BarChart3 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const { data: classes, isLoading: classesLoading } = trpc.class.getMyClasses.useQuery();
  const { data: earnings, isLoading: earningsLoading } = trpc.payment.getMyEarnings.useQuery();
  const { data: paymentHistory, isLoading: paymentsLoading } =
    trpc.payment.getMyPaymentHistory.useQuery();

  const isLoading = classesLoading || earningsLoading || paymentsLoading;

  // Calculate metrics
  const totalStudents = classes?.reduce((acc, cls) => acc + (cls.enrollmentCount || 0), 0) || 0;
  const totalRevenue = earnings?.totalEarnings || 0;
  const publishedClasses = classes?.filter((c) => c.status === 'published').length || 0;

  // Average completion rate (mock data - would come from backend)
  const avgCompletionRate = 68;

  // Revenue over time data
  const getRevenueData = () => {
    if (!paymentHistory) return [];

    const monthlyData: Record<string, number> = {};

    paymentHistory.forEach((payment) => {
      if (payment.status === 'completed') {
        const date = new Date(payment.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = 0;
        }
        monthlyData[monthKey] += payment.teacherAmount;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, revenue]) => ({
        month: new Date(month).toLocaleDateString('default', { month: 'short', year: 'numeric' }),
        revenue: Math.round(revenue),
      }));
  };

  // Revenue by class
  const getRevenueByClass = () => {
    if (!classes || !paymentHistory) return [];

    const classRevenue: Record<string, { name: string; revenue: number }> = {};

    paymentHistory.forEach((payment) => {
      if (payment.status === 'completed') {
        const classId = payment.classId._id.toString();
        if (!classRevenue[classId]) {
          classRevenue[classId] = {
            name: payment.classId.title,
            revenue: 0,
          };
        }
        classRevenue[classId].revenue += payment.teacherAmount;
      }
    });

    return Object.values(classRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  // Student enrollment by class
  const getEnrollmentData = () => {
    if (!classes) return [];

    return classes
      .filter((c) => c.status === 'published')
      .map((cls) => ({
        name: cls.title.length > 20 ? cls.title.substring(0, 20) + '...' : cls.title,
        students: cls.enrollmentCount || 0,
      }))
      .sort((a, b) => b.students - a.students)
      .slice(0, 5);
  };

  const revenueData = getRevenueData();
  const revenueByClass = getRevenueByClass();
  const enrollmentData = getEnrollmentData();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Insights into your teaching performance and revenue
          </p>
        </div>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedClasses}</div>
            <p className="text-xs text-muted-foreground">Published classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">Student progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly earnings over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No revenue data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Student Enrollment by Class */}
        <Card>
          <CardHeader>
            <CardTitle>Students by Class</CardTitle>
            <CardDescription>Top 5 classes by enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            {enrollmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  <Bar dataKey="students" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No enrollment data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Class */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Class</CardTitle>
            <CardDescription>Top 5 revenue-generating classes</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueByClass.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueByClass}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `$${entry.revenue}`}
                  >
                    {revenueByClass.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No revenue data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key metrics and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Growing Student Base</p>
                <p className="text-xs text-muted-foreground">
                  {totalStudents} students enrolled across your classes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Strong Engagement</p>
                <p className="text-xs text-muted-foreground">
                  Average {avgCompletionRate}% completion rate
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Steady Revenue</p>
                <p className="text-xs text-muted-foreground">
                  ${totalRevenue.toFixed(2)} earned to date
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Recommendations</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>• Consider creating more content in your top-performing categories</li>
                <li>• Engage with students through Q&A to boost completion rates</li>
                <li>• Promote your least-enrolled classes to increase reach</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
