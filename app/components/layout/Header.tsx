"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Bell,
  ChevronDown,
  Edit,
  LogOut,
  Plus,
  Trash2,
  Wallet,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import CreatePaymentSchedule from "../CreatePayment";
export function Header() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    setIsConnecting(true);
    try {
      // Check if ethereum object exists
      if (!window.ethereum) {
        alert("Please install MetaMask or another Web3 wallet!");
        return;
      }

      // Request accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };
  async function disconnectWallet() {
    setAccount(null);
  }

  return (
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
                <CreatePaymentSchedule userAddr={account} />
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
                className="flex items-center space-x-2 "
                onClick={connectWallet}
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden md:inline">
                  {account || "Connect Wallet"}
                </span>
                {account && <ChevronDown className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            {account && (
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Wallet</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(account || "")}
                >
                  Copy Address
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnectWallet}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
