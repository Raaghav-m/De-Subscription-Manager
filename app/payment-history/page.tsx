"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Sample data structure - replace with your actual data
const paymentHistory = [
  {
    id: 1,
    date: "2024-03-15",
    recipient: "0x1234...5678",
    amount: 10,
    token: "PYUSD",
    status: "Success",
    subscriptionName: "Monthly Newsletter",
    frequency: "Monthly",
  },
  {
    id: 2,
    date: "2024-03-01",
    recipient: "0x8765...4321",
    amount: 50,
    token: "PYUSD",
    status: "Failed",
    subscriptionName: "Premium Service",
    frequency: "Monthly",
  },
  {
    id: 3,
    date: "2024-02-15",
    recipient: "0x9876...5432",
    amount: 100,
    token: "PYUSD",
    status: "Success",
    subscriptionName: "Annual Membership",
    frequency: "Yearly",
  },
];

export default function PaymentHistory() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = paymentHistory.filter((payment) => {
    const matchesFilter =
      filter === "all" ||
      payment.status.toLowerCase() === filter.toLowerCase();
    
    const matchesSearch =
      payment.subscriptionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.recipient.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Payment History</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search by subscription or recipient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {new Date(payment.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{payment.subscriptionName}</TableCell>
                    <TableCell>{payment.recipient}</TableCell>
                    <TableCell>
                      {payment.amount} {payment.token}
                    </TableCell>
                    <TableCell>{payment.frequency}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "Success" ? "default" : "destructive"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 