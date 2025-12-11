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
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';

export function EarningsPage() {
  const { data: earnings, isLoading: earningsLoading } = trpc.payment.getMyEarnings.useQuery();
  const { data: paymentHistory, isLoading: paymentsLoading } =
    trpc.payment.getMyPaymentHistory.useQuery();

  if (earningsLoading || paymentsLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const totalEarnings = earnings?.totalEarnings || 0;
  const totalPayments = paymentHistory?.length || 0;

  // Calculate monthly earnings (current month)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyEarnings =
    paymentHistory?.reduce((acc, payment) => {
      const paymentDate = new Date(payment.createdAt);
      if (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear &&
        payment.status === 'completed'
      ) {
        return acc + payment.teacherAmount;
      }
      return acc;
    }, 0) || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
        <p className="text-muted-foreground">Track your revenue and payment history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayments}</div>
            <p className="text-xs text-muted-foreground">Received</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {!paymentHistory || paymentHistory.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No payments yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You'll see payment history here once students enroll in your classes.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Your Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment._id.toString()}>
                      <TableCell>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {payment.studentId.firstName} {payment.studentId.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {payment.studentId.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <div className="font-medium line-clamp-1">
                            {payment.classId.title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>Month {payment.month}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === 'completed'
                              ? 'default'
                              : payment.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        ${payment.teacherAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Fee Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800">
            <strong>Platform Fee:</strong> The platform takes a 20% fee from each payment. You
            receive 80% of the monthly fee paid by students. For example, if your class fee is
            $100/month, you'll receive $80 per student.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
