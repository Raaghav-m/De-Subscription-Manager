"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bell,
  ChevronDown,
  Edit,
  LogOut,
  Plus,
  Trash2,
  Wallet,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreatePaymentSchedule from "@/components/CreatePayment";

// Placeholder data
const activeSchedules = [
  {
    id: 1,
    recipient: "0x1234...5678",
    amount: 10,
    token: "PYUSD",
    frequency: "Monthly",
    nextPayment: "2024-11-30",
    status: "Scheduled",
  },
  {
    id: 2,
    recipient: "0x5678...1234",
    amount: 5,
    token: "PYUSD",
    frequency: "Weekly",
    nextPayment: "2024-11-07",
    status: "Scheduled",
  },
  {
    id: 3,
    recipient: "0x9876...5432",
    amount: 100,
    token: "PYUSD",
    frequency: "Yearly",
    nextPayment: "2025-01-01",
    status: "Scheduled",
  },
];

const upcomingPayments = [
  {
    id: 1,
    amount: 10,
    token: "PYUSD",
    recipient: "0x1234...5678",
    date: "2024-11-30",
  },
  {
    id: 2,
    amount: 5,
    token: "PYUSD",
    recipient: "0x5678...1234",
    date: "2024-11-07",
  },
];

const recentPayments = [
  {
    id: 1,
    amount: 10,
    token: "PYUSD",
    recipient: "0x1234...5678",
    date: "2024-10-30",
    status: "Success",
  },
  {
    id: 2,
    amount: 5,
    token: "PYUSD",
    recipient: "0x5678...1234",
    date: "2024-10-23",
    status: "Success",
  },
];

export default function Dashboard() {
  const [connectedWallet, setConnectedWallet] = useState("0x1234...5678");

  const disconnectWallet = () => {
    setConnectedWallet("");
    // Implement actual wallet disconnection logic here
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">payzLoop</h1>
            <nav className="hidden md:flex space-x-4">
              <Button variant="link">Dashboard</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link">Create Schedule</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <CreatePaymentSchedule />
                </DialogContent>
              </Dialog>
              <Button variant="link">Payment History</Button>
              <Button variant="link">Withdraw Funds</Button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="hidden md:inline">{connectedWallet}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Wallet</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(connectedWallet)}
                >
                  Copy Address
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnectWallet}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Welcome back, User!</h2>

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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Payment Schedules</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{schedule.recipient}</TableCell>
                    <TableCell>
                      {schedule.amount} {schedule.token}
                    </TableCell>
                    <TableCell>{schedule.frequency}</TableCell>
                    <TableCell>{schedule.nextPayment}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          schedule.status === "Scheduled"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {schedule.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Schedule</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Cancel Schedule</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create New Schedule</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <CreatePaymentSchedule />
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="flex items-center space-x-2">
            <Wallet className="h-4 w-4" />
            <span>Withdraw Funds</span>
          </Button>
        </div>
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 payzLoop. All rights reserved.
          </p>
          <nav className="flex space-x-4">
            <Button variant="link" size="sm">
              FAQ
            </Button>
            <Button variant="link" size="sm">
              Support
            </Button>
            <Button variant="link" size="sm">
              Terms of Service
            </Button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
