import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentHistory } from '@/components/student/payment/PaymentHistory';
import { UpcomingPayments } from '@/components/student/payment/UpcomingPayments';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/trpc';
import { DollarSign, Calendar, CreditCard } from 'lucide-react';

export function PaymentsPage() {
  const { data: paymentData, isLoading } = trpc.payment.getMyPayments.useQuery();

  const totalPaid = paymentData?.history
    ?.filter(p => p.status === 'completed')
    ?.reduce((acc, p) => acc + p.amount + p.platformFee, 0) || 0;

  const upcomingCount = paymentData?.upcoming?.length || 0;
  const overdueCount = paymentData?.upcoming?.filter(p => p.status === 'overdue').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Payments</h1>
        <p className="text-muted-foreground">
          Manage your payments and view transaction history
        </p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Paid
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Payments
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingCount}</div>
              <p className="text-xs text-muted-foreground">
                Payments due
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overdue
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {overdueCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingCount})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({paymentData?.history?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <UpcomingPayments payments={paymentData?.upcoming || []} />
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <PaymentHistory payments={paymentData?.history || []} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
