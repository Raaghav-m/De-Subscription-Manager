"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Clock,
  Wallet,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function CreatePaymentSchedule() {
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    frequency: "monthly",
    totalLimit: "",
    token: "ETH",
  });

  const [step, setStep] = useState(1);

  const calculateTotalPayments = () => {
    const frequencies = {
      weekly: 52,
      monthly: 12,
      yearly: 1,
    };
    const periodsPerYear =
      frequencies[formData.frequency as keyof typeof frequencies];
    const amountPerPeriod = parseFloat(formData.amount) || 0;
    const totalLimit = parseFloat(formData.totalLimit) || 0;
    const maxPayments = Math.floor(totalLimit / amountPerPeriod);

    return {
      periodsPerYear,
      totalYears: maxPayments / periodsPerYear,
      maxPayments,
    };
  };

  const { maxPayments, totalYears } = calculateTotalPayments();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.recipient && formData.amount && formData.token;
      case 2:
        return formData.frequency && formData.totalLimit;
      default:
        return true;
    }
  };

  return (
    <div className="p-4">
      <Progress value={(step / 3) * 100} className="mb-6" />

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="recipient"
              className="block text-sm font-medium mb-1"
            >
              Recipient Address
            </label>
            <Input
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleInputChange}
              placeholder="0x..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium mb-1"
              >
                Amount
              </label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="token" className="block text-sm font-medium mb-1">
                Token
              </label>
              <Select
                value={formData.token}
                onValueChange={(value) => handleSelectChange("token", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="DAI">DAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="frequency"
              className="block text-sm font-medium mb-1"
            >
              Payment Frequency
            </label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => handleSelectChange("frequency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="totalLimit"
              className="block text-sm font-medium mb-1"
            >
              Total Limit
            </label>
            <Input
              id="totalLimit"
              name="totalLimit"
              type="number"
              value={formData.totalLimit}
              onChange={handleInputChange}
              placeholder="Total amount to deposit"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Review Payment Schedule</h3>

          <div className="bg-secondary p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient:</span>
              <span className="font-medium">{`${formData.recipient.slice(
                0,
                6
              )}...${formData.recipient.slice(-4)}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount per payment:</span>
              <span className="font-medium">{`${formData.amount} ${formData.token}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frequency:</span>
              <span className="font-medium">{formData.frequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Limit:</span>
              <span className="font-medium">{`${formData.totalLimit} ${formData.token}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Maximum Payments:</span>
              <span className="font-medium">{maxPayments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{`~${totalYears.toFixed(
                1
              )} years`}</span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-600 dark:text-blue-400">
              You'll need to approve this transaction and deposit{" "}
              {formData.totalLimit} {formData.token} to create this payment
              schedule.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <Button
            onClick={() => setStep(step - 1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        )}
        <Button
          onClick={() => {
            if (step < 3) {
              setStep(step + 1);
            } else {
              // Handle contract interaction here
              console.log("Create schedule:", formData);
            }
          }}
          disabled={!isStepValid()}
          className="ml-auto flex items-center gap-2"
        >
          {step === 3 ? (
            <>
              <Wallet className="w-4 h-4" />
              Create Schedule
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
