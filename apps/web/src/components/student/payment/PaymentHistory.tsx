import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface Payment {
  _id: string;
  class: {
    title: string;
  };
  amount: number;
  platformFee: number;
  month: number;
  status: 'completed' | 'pending' | 'failed';
  paymentDate: Date;
  invoiceUrl?: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No payment history yet
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Invoice</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment._id}>
              <TableCell>
                {new Date(payment.paymentDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium">
                {payment.class.title}
              </TableCell>
              <TableCell>Month {payment.month}</TableCell>
              <TableCell>
                ${(payment.amount + payment.platformFee).toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {payment.invoiceUrl && payment.status === 'completed' && (
                  <Button size="sm" variant="ghost" asChild>
                    <a href={payment.invoiceUrl} download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
