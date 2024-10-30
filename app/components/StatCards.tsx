import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { UpcomingPayment, RecentPayment } from "@/app/types/payment";

interface StatCardsProps {
  upcomingPayments: UpcomingPayment[];
  recentPayments: RecentPayment[];
}

export function StatCards({
  upcomingPayments,
  recentPayments,
}: StatCardsProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">100 PYUSD</p>
          <p className="text-sm text-muted-foreground">
            3 Scheduled Payments | 5 Executed Payments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {upcomingPayments.map((payment) => (
              <li
                key={payment.id}
                className="flex justify-between items-center"
              >
                <span>
                  {payment.amount} {payment.token} to {payment.recipient}
                </span>
                <span className="text-sm text-muted-foreground">
                  {payment.date}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentPayments.map((payment) => (
              <li
                key={payment.id}
                className="flex justify-between items-center"
              >
                <span>
                  {payment.amount} {payment.token} to {payment.recipient}
                </span>
                <Badge
                  variant={
                    payment.status === "Success" ? "default" : "destructive"
                  }
                >
                  {payment.status}
                </Badge>
              </li>
            ))}
          </ul>
          <Button variant="link" className="mt-4 p-0">
            View Full History
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
