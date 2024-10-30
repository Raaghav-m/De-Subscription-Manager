"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { Plus, Wallet } from "lucide-react";
import CreatePaymentSchedule from "../components/CreatePayment";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { StatCards } from "../components/StatCards";
import { PaymentSchedulesTable } from "../components/PaymentSchedulesTable";
import {
  activeSchedules,
  upcomingPayments,
  recentPayments,
} from "@/app/data/mockData"; // Move mock data to separate file

export default function Dashboard() {
  const [connectedWallet, setConnectedWallet] = useState("Connect Wallet");
  const [hasEthereum, setHasEthereum] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // useEffect(() => {
  //   const checkWalletConnection = async () => {
  //     if (typeof window !== "undefined" && window.ethereum) {
  //       const isConnected = window.ethereum.isConnected();
  //       console.log("Provider Connected:", isConnected);

  //       const accounts = await window.ethereum.request({
  //         method: "eth_accounts",
  //       });
  //       if (accounts.length > 0) {
  //         console.log("Connected Account:", accounts[0]);
  //         return true;
  //       } else {
  //         console.log("No accounts connected");
  //         return false;
  //       }
  //     } else {
  //       // If MetaMask is not installed, update states only if needed
  //       setHasEthereum(false);
  //       setConnectedWallet("Connect Wallet");
  //       setIsConnecting(false); // Ensure connecting state is reset
  //       console.log("MetaMask not installed");
  //       return false;
  //     }
  //   };

  //   checkWalletConnection();
  // }, []);

  const disconnectWallet = () => {
    setConnectedWallet("");
    // Implement actual wallet disconnection logic here
  };

  const connectWallet = async () => {
    if (
      typeof window !== "undefined" &&
      window.ethereum &&
      !connectedWallet &&
      !isConnecting
    ) {
      try {
        setIsConnecting(true); // Disable button
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setConnectedWallet(accounts[0]);
      } catch (error: any) {
        if (error.code === -32002) {
          console.error("Connection request already pending. Please wait.");
          alert("A wallet connection request is already pending. Please wait.");
        } else {
          console.error("Error connecting wallet:", error);
        }
      } finally {
        setIsConnecting(false); // Re-enable button
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Welcome back, User!</h2>

        <StatCards
          upcomingPayments={upcomingPayments}
          recentPayments={recentPayments}
        />

        <PaymentSchedulesTable schedules={activeSchedules} />

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

      <Footer />
    </div>
  );
}
