"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Coins, TrendingUp, Calendar, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"

interface CropProject {
  id: string
  farmer: string
  cropType: string
  location: string
  plantedArea: number
  expectedRevenue: number
  harvestDate: string
  apy: number
  funded: number
  target: number
  status: "active" | "funded" | "harvested"
  riskScore: "low" | "medium" | "high"
  daysLeft: number
}

interface InvestmentModalProps {
  isOpen: boolean
  onClose: () => void
  project: CropProject | null
  onInvestmentComplete: (projectId: string, amount: number) => void
}

export default function InvestmentModal({ isOpen, onClose, project, onInvestmentComplete }: InvestmentModalProps) {
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [userBalance] = useState(50000) // Mock user balance

  useEffect(() => {
    if (isOpen) {
      setInvestmentAmount(1000)
      setIsConfirming(false)
      setIsProcessing(false)
      setIsCompleted(false)
    }
  }, [isOpen])

  if (!project) return null

  const remainingAmount = project.target - project.funded
  const maxInvestment = Math.min(remainingAmount, userBalance)
  const minInvestment = 100

  const handleAmountChange = (value: string) => {
    const numValue = Number.parseFloat(value) || 0
    if (numValue >= minInvestment && numValue <= maxInvestment) {
      setInvestmentAmount(numValue)
    }
  }

  const handleSliderChange = (value: number[]) => {
    setInvestmentAmount(value[0])
  }

  const calculateReturns = () => {
    const annualReturn = (investmentAmount * project.apy) / 100
    const daysToHarvest = project.daysLeft
    const dailyReturn = annualReturn / 365
    const totalReturn = dailyReturn * daysToHarvest
    return {
      totalReturn: totalReturn,
      totalReceived: investmentAmount + totalReturn,
      roi: (totalReturn / investmentAmount) * 100,
    }
  }

  const returns = calculateReturns()

  const handleInvest = () => {
    setIsConfirming(true)
  }

  const handleConfirmInvestment = async () => {
    setIsProcessing(true)

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    setIsCompleted(true)

    // Wait a bit before calling the completion callback
    setTimeout(() => {
      onInvestmentComplete(project.id, investmentAmount)
      onClose()
    }, 2000)
  }

  const handleBack = () => {
    setIsConfirming(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "high":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center">
            <Coins className="w-6 h-6 mr-2 text-yellow-400" />
            {isCompleted ? "Investment Successful!" : isConfirming ? "Confirm Investment" : "Invest in Project"}
          </DialogTitle>
        </DialogHeader>

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
              <h3 className="text-2xl font-bold text-white mb-2">Investment Confirmed!</h3>
              <p className="text-gray-300 mb-4">
                You have successfully invested ${investmentAmount.toLocaleString()} USDC in {project.farmer}'s{" "}
                {project.cropType} project.
              </p>
              <p className="text-sm text-gray-400">
                You will receive updates on the project progress and returns after harvest.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: isConfirming ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isConfirming ? 20 : -20 }}
              className="space-y-6"
            >
              {/* Project Summary */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{project.farmer}</h3>
                      <p className="text-gray-400 text-sm">{project.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-semibold">{project.cropType}</p>
                      <p className="text-sm text-gray-400">{project.plantedArea} hectares</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">APY</p>
                      <p className="text-yellow-400 font-semibold">{project.apy}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Risk</p>
                      <p className={`font-semibold ${getRiskColor(project.riskScore)}`}>
                        {project.riskScore.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Days Left</p>
                      <p className="text-white font-semibold">{project.daysLeft}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Funding Progress</span>
                      <span className="text-white">
                        ${project.funded.toLocaleString()} / ${project.target.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${(project.funded / project.target) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {!isConfirming ? (
                <>
                  {/* Investment Amount Selection */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="amount" className="text-gray-200 text-base font-semibold">
                        Investment Amount (USDC)
                      </Label>
                      <div className="mt-2">
                        <Input
                          id="amount"
                          type="number"
                          value={investmentAmount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                          min={minInvestment}
                          max={maxInvestment}
                          className="bg-gray-700 border-gray-600 text-white text-lg font-semibold"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>Min: ${minInvestment}</span>
                        <span>Available: ${remainingAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="px-2">
                      <Slider
                        value={[investmentAmount]}
                        onValueChange={handleSliderChange}
                        max={maxInvestment}
                        min={minInvestment}
                        step={100}
                        className="w-full"
                      />
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      {[1000, 5000, 10000, maxInvestment].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setInvestmentAmount(amount)}
                          className={`border-gray-600 text-gray-300 hover:bg-gray-700 ${
                            investmentAmount === amount ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" : ""
                          }`}
                        >
                          ${amount === maxInvestment ? "Max" : (amount / 1000).toFixed(0) + "K"}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Investment Summary */}
                  <Card className="bg-gray-800/30 border-gray-600">
                    <CardContent className="p-4">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-yellow-400" />
                        Investment Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Investment Amount:</span>
                          <span className="text-white font-semibold">${investmentAmount.toLocaleString()} USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Expected Return:</span>
                          <span className="text-yellow-400 font-semibold">${returns.totalReturn.toFixed(2)} USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total to Receive:</span>
                          <span className="text-green-400 font-semibold">${returns.totalReceived.toFixed(2)} USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">ROI:</span>
                          <span className="text-yellow-400 font-semibold">{returns.roi.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Harvest Date:</span>
                          <span className="text-white">{new Date(project.harvestDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risk Warning */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="text-yellow-400 font-semibold mb-1">Investment Risk Notice</p>
                        <p className="text-gray-300">
                          Agricultural investments carry inherent risks including weather, market conditions, and crop
                          failure. Past performance does not guarantee future results.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleInvest}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                      disabled={investmentAmount < minInvestment || investmentAmount > maxInvestment}
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      Invest ${investmentAmount.toLocaleString()}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Confirmation Screen */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white mb-2">Confirm Your Investment</h3>
                      <p className="text-gray-400">Please review your investment details before confirming</p>
                    </div>

                    {/* Final Investment Details */}
                    <Card className="bg-gray-800/30 border-gray-600">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="text-center border-b border-gray-700 pb-4">
                            <p className="text-3xl font-bold text-yellow-400">
                              ${investmentAmount.toLocaleString()} USDC
                            </p>
                            <p className="text-gray-400">Investment Amount</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-400">${returns.totalReceived.toFixed(2)}</p>
                              <p className="text-gray-400">Expected Total Return</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-yellow-400">{returns.roi.toFixed(2)}%</p>
                              <p className="text-gray-400">ROI</p>
                            </div>
                          </div>

                          <div className="text-center text-sm text-gray-400">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Expected payout: {new Date(project.harvestDate).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Transaction Details */}
                    <div className="bg-gray-800/30 rounded-lg p-4 text-sm">
                      <h4 className="text-white font-semibold mb-2">Transaction Details</h4>
                      <div className="space-y-1 text-gray-400">
                        <p>• Investment will be locked until harvest date</p>
                        <p>• Returns calculated based on {project.apy}% APY</p>
                        <p>• Smart contract will automatically distribute returns</p>
                        <p>• Transaction fee: ~$2-5 USDC (network dependent)</p>
                      </div>
                    </div>

                    {/* Confirmation Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                        disabled={isProcessing}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleConfirmInvestment}
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
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm Investment
                          </>
                        )}
                      </Button>
                    </div>

                    {isProcessing && (
                      <div className="text-center text-sm text-gray-400">
                        <p>Please wait while we process your transaction...</p>
                        <p>This may take a few moments to confirm on the blockchain.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
