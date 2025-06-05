"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Loader2,
  FileText,
  MapPin,
  Calendar,
  DollarSign,
  Coins,
  AlertTriangle,
} from "lucide-react";

interface TokenizeData {
  assetType: string;
  quantity: string;
  pricePerUnit: string;
  expectedHarvestDate: string;
  expectedDeliveryDate: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description: string;
}

interface TokenizeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: TokenizeData;
  uploadedFiles: string[];
  onConfirm: () => void;
}

export default function TokenizeConfirmationModal({
  isOpen,
  onClose,
  formData,
  uploadedFiles,
  onConfirm,
}: TokenizeConfirmationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const platformFee = 2.5;
  const interestRate = 8.5;
  const maxValue = formData.pricePerUnit ? 
    (Number.parseFloat(formData.pricePerUnit) * Number.parseFloat(formData.quantity || "0") * 0.7).toFixed(0) 
    : "0";

  const handleConfirm = async () => {
    setIsProcessing(true);

    // Simulate blockchain transaction and validation
    await new Promise((resolve) => setTimeout(resolve, 4000));

    setIsProcessing(false);
    setIsCompleted(true);

    // Wait a bit before calling the completion callback
    setTimeout(() => {
      onConfirm();
      onClose();
      // Reset states for next time
      setTimeout(() => {
        setIsCompleted(false);
        setIsProcessing(false);
      }, 500);
    }, 2500);
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      // Reset states when closing
      setTimeout(() => {
        setIsCompleted(false);
        setIsProcessing(false);
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-white flex items-center">
            <Coins className="w-6 h-6 mr-2 text-yellow-400" />
            {isCompleted
              ? "Project Published Successfully!"
              : "Confirm Project Publication"}
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
                  Project Published!
                </h3>
                <p className="text-gray-300 mb-4">
                  Your {formData.assetType} project has been successfully
                  tokenized and is now available for investment.
                </p>
                <p className="text-sm text-gray-400">
                  Investors can now discover and fund your project. You'll
                  receive notifications when funding milestones are reached.
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
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Review Your Project Details
                  </h3>
                  <p className="text-gray-400">
                    Please confirm all information before publishing your
                    project
                  </p>
                </div>

                {/* Project Summary */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-yellow-400" />
                      Project Information
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-400">Asset Type</p>
                          <p className="text-white font-semibold capitalize">
                            {formData.assetType}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Quantity</p>
                          <p className="text-white font-semibold">
                            {formData.quantity} units
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Price per Unit</p>
                          <p className="text-white font-semibold">
                            ${Number.parseFloat(formData.pricePerUnit || "0").toLocaleString()} USDC
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Total Value</p>
                          <p className="text-white font-semibold">
                            ${(Number.parseFloat(formData.pricePerUnit || "0") * Number.parseFloat(formData.quantity || "0")).toLocaleString()} USDC
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-400">Expected Harvest Date</p>
                          <p className="text-white font-semibold">
                            {new Date(formData.expectedHarvestDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Expected Delivery Date</p>
                          <p className="text-white font-semibold">
                            {new Date(formData.expectedDeliveryDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Location</p>
                          <p className="text-white font-semibold">
                            {formData.location.address}
                          </p>
                          <p className="text-gray-400 text-sm">
                            ({formData.location.latitude}, {formData.location.longitude})
                          </p>
                        </div>
                      </div>
                    </div>

                    {formData.description && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-gray-400 text-sm mb-2">
                          Description
                        </p>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {formData.description}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Documentation */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-yellow-400" />
                      Documentation ({uploadedFiles.length} files)
                    </h4>

                    {uploadedFiles.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center p-2 bg-gray-700/50 rounded"
                          >
                            <FileText className="w-4 h-4 text-yellow-400 mr-2" />
                            <span className="text-white text-sm">{file}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No documents uploaded
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Financial Summary */}
                <Card className="bg-gray-800/30 border-gray-600">
                  <CardContent className="p-6">
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-yellow-400" />
                      Financial Terms
                    </h4>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-yellow-400">
                          {platformFee}%
                        </p>
                        <p className="text-gray-400 text-sm">Platform Fee</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-yellow-400">
                          {interestRate}%
                        </p>
                        <p className="text-gray-400 text-sm">
                          Interest Rate (p.a.)
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-400">
                          ${maxValue}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Max Funding (USDC)
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="text-xs text-gray-400 space-y-1">
                        <p>• 70% of expected revenue available for financing</p>
                        <p>
                          • Smart contract will automatically manage repayments
                        </p>
                        <p>• Project will be validated by Chainlink oracles</p>
                        <p>
                          • Funding period: Until harvest date or fully funded
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Notice */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-yellow-400 font-semibold mb-1">
                        Important Notice
                      </p>
                      <p className="text-gray-300">
                        By publishing this project, you agree to the platform
                        terms and commit to repaying investors according to the
                        agreed terms. All information provided will be verified
                        by our oracle network.
                      </p>
                    </div>
                  </div>
                </div>

                {isProcessing ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Processing Tokenization
                    </h3>
                    <p className="text-gray-400">
                      Please wait while we process your request...
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="bg-yellow-400 rounded-full p-2 mr-3">
                          <Coins className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            Tokenization Summary
                          </h3>
                          <p className="text-sm text-gray-400">
                            Review your asset details before proceeding
                          </p>
                        </div>
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className="border-yellow-400 text-yellow-400"
                        >
                          {formData.assetType}
                        </Badge>
                      </div>
                    </div>
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
                    Publishing...
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4 mr-2" />
                    Publish Project
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
