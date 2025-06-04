"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  Loader2,
  Download,
  Wallet,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  isInvestor: boolean;
  isProcessing: boolean;
  onConfirm: () => void;
}

export default function WithdrawModal({
  isOpen,
  onClose,
  item,
  isInvestor,
  isProcessing,
  onConfirm,
}: WithdrawModalProps) {
  const [withdrawMethod, setWithdrawMethod] = useState("wallet");
  const [walletAddress, setWalletAddress] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  if (!item) return null;

  const amountRaw = isInvestor ? item?.returnedAmount : item?.fundsAvailable;
  const amount =
    typeof amountRaw === "number" && !isNaN(amountRaw) ? amountRaw : 0;
  const title = isInvestor ? item.cropType : `${item.cropType} Project`;
  const subtitle = isInvestor ? item.farmer : `${item.plantedArea} hectares`;

  const handleConfirm = async () => {
    await onConfirm();
    setIsCompleted(true);
    // Reset after 3 seconds
    setTimeout(() => {
      setIsCompleted(false);
      setWithdrawMethod("wallet");
      setWalletAddress("");
    }, 3000);
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      // Reset states when closing
      setTimeout(() => {
        setIsCompleted(false);
        setWithdrawMethod("wallet");
        setWalletAddress("");
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-white flex items-center">
            <Download className="w-6 h-6 mr-2 text-yellow-400" />
            {isCompleted ? "Withdrawal Successful!" : "Withdraw Funds"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Funds Withdrawn!
                </h3>
                <p className="text-gray-300 mb-4">
                  ${amount.toLocaleString()} USDC has been successfully
                  transferred to your{" "}
                  {withdrawMethod === "wallet" ? "wallet" : "bank account"}.
                </p>
                <p className="text-sm text-gray-400">
                  {withdrawMethod === "wallet"
                    ? "Transaction has been confirmed on the blockchain."
                    : "Bank transfer may take 1-3 business days to complete."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 pb-6"
              >
                {/* Project/Investment Summary */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {title}
                        </h3>
                        <p className="text-gray-400 text-sm">{subtitle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">
                          Available to withdraw
                        </p>
                        <p className="text-xl font-bold text-green-400">
                          ${amount.toLocaleString()} USDC
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Withdrawal Method */}
                <div className="space-y-4">
                  <Label htmlFor="withdrawMethod" className="text-gray-200">
                    Withdrawal Method
                  </Label>
                  <Select
                    value={withdrawMethod}
                    onValueChange={setWithdrawMethod}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select withdrawal method" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="wallet">Crypto Wallet</SelectItem>
                      <SelectItem value="bank">Bank Account</SelectItem>
                    </SelectContent>
                  </Select>

                  {withdrawMethod === "wallet" ? (
                    <div className="space-y-2">
                      <Label htmlFor="walletAddress" className="text-gray-200">
                        Wallet Address
                      </Label>
                      <Input
                        id="walletAddress"
                        placeholder="0x..."
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                      <p className="text-xs text-gray-400">
                        Leave empty to use your connected wallet: 0x1234...5678
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-300">
                        Funds will be sent to your verified bank account ending
                        in **** 1234
                      </p>
                      <p className="text-xs text-gray-400">
                        Bank transfers may take 1-3 business days to complete
                      </p>
                    </div>
                  )}
                </div>

                {/* Fee Information */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-white">
                      ${amount.toLocaleString()} USDC
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Network Fee</span>
                    <span className="text-white">$2.50 USDC</span>
                  </div>
                  <div className="border-t border-gray-700 my-2"></div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-300">Total to Receive</span>
                    <span className="text-green-400">
                      ${(amount - 2.5).toLocaleString()} USDC
                    </span>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-yellow-400 font-semibold mb-1">
                        Important
                      </p>
                      <p className="text-gray-300">
                        Please verify all details before confirming. Withdrawals
                        cannot be reversed once processed.
                      </p>
                    </div>
                  </div>
                </div>

                {isProcessing && (
                  <div className="text-center text-sm text-gray-400 bg-gray-800/30 rounded-lg p-4">
                    <p>Processing withdrawal...</p>
                    <p>
                      This may take a few moments to complete on the blockchain.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Action Buttons */}
        {!isCompleted && (
          <div className="flex-shrink-0 border-t border-gray-700 pt-4 mt-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {withdrawMethod === "wallet" ? (
                      <Wallet className="w-4 h-4 mr-2" />
                    ) : (
                      <ArrowRight className="w-4 h-4 mr-2" />
                    )}
                    Confirm Withdrawal
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
