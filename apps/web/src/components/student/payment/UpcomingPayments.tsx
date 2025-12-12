import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useState } from 'react';

interface UpcomingPayment {
  enrollmentId: string;
  class: {
    _id: string;
    title: string;
    monthlyFee: number;
    platformFee: number;
  };
  month: number;
  dueDate: Date;
  status: 'pending' | 'overdue';
}

interface UpcomingPaymentsProps {
  payments: UpcomingPayment[];
}

export function UpcomingPayments({ payments }: UpcomingPaymentsProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const utils = trpc.useContext();

  const paymentMutation = trpc.payment.createPayment.useMutation({
    onSuccess: () => {
      toast.success('Payment processed successfully!');
      utils.payment.getMyPayments.invalidate();
      utils.enrollment.getMyEnrollments.invalidate();
      setProcessingId(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Payment failed. Please try again.');
      setProcessingId(null);
    },
  });

  const handlePayment = (enrollmentId: string, month: number) => {
    setProcessingId(enrollmentId);
    paymentMutation.mutate({
      enrollmentId,
      monthNumber: month,
      paymentMethod: 'card' as const, // Default payment method
    });
  };

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            No upcoming payments
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => {
        const isOverdue = payment.status === 'overdue';
        const isProcessing = processingId === payment.enrollmentId;
        const totalAmount = payment.class.monthlyFee + payment.class.platformFee;

        return (
          <Card
            key={payment.enrollmentId}
            className={isOverdue ? 'border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/50' : ''}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{payment.class.title}</h3>
                    {isOverdue && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Overdue
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Due: {new Date(payment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>Month {payment.month} Payment</div>
                    <div className="font-medium text-foreground">
                      ${payment.class.monthlyFee.toFixed(2)} + $
                      {payment.class.platformFee.toFixed(2)} platform fee = $
                      {totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handlePayment(payment.enrollmentId, payment.month)}
                  disabled={isProcessing}
                  variant={isOverdue ? 'destructive' : 'default'}
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
