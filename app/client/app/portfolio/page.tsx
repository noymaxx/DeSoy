"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  DollarSign,
  Coins,
  Tractor,
  BarChart3,
  AlertCircle,
  ArrowUpRight,
  Download,
  Eye,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import WithdrawModal from "../components/WithdrawModal";
import InvestmentDetailsModal from "../components/InvestmentDetailsModal";

// Mock data for investments
const investorData = {
  stats: {
    totalInvested: 45000,
    totalEarned: 5850,
    activeInvestments: 3,
    completedInvestments: 2,
    averageAPY: 13.2,
  },
  activeInvestments: [
    {
      id: "1",
      farmer: "Marko Petrović",
      cropType: "Soy",
      location: "Vojvodina, Serbia",
      investedAmount: 15000,
      expectedReturn: 16875,
      harvestDate: "2024-10-15",
      apy: 12.5,
      daysLeft: 45,
      progress: 75,
    },
    {
      id: "2",
      farmer: "Stefan Jovanović",
      cropType: "Corn",
      location: "Bačka, Serbia",
      investedAmount: 20000,
      expectedReturn: 22360,
      harvestDate: "2024-09-30",
      apy: 11.8,
      daysLeft: 67,
      progress: 40,
    },
    {
      id: "3",
      farmer: "Jelena Kovačević",
      cropType: "Sunflower",
      location: "Banat, Serbia",
      investedAmount: 10000,
      expectedReturn: 11520,
      harvestDate: "2024-11-20",
      apy: 15.2,
      daysLeft: 92,
      progress: 25,
    },
  ],
  completedInvestments: [
    {
      id: "4",
      farmer: "Ana Nikolić",
      cropType: "Raspberries",
      location: "Šumadija, Serbia",
      investedAmount: 12000,
      returnedAmount: 13824,
      profit: 1824,
      harvestDate: "2024-07-20",
      completedDate: "2024-07-22",
      apy: 15.2,
      status: "available",
    },
    {
      id: "5",
      farmer: "Milica Stojanović",
      cropType: "Wheat",
      location: "Banat, Serbia",
      investedAmount: 8000,
      returnedAmount: 9048,
      profit: 1048,
      harvestDate: "2024-08-10",
      completedDate: "2024-08-12",
      apy: 13.1,
      status: "withdrawn",
      withdrawDate: "2024-08-15",
    },
  ],
};

// Mock data for farmer projects
const farmerData = {
  stats: {
    totalRaised: 175000,
    totalProjects: 3,
    activeProjects: 2,
    completedProjects: 1,
    averageInterestRate: 8.5,
  },
  activeProjects: [
    {
      id: "1",
      cropType: "Soy",
      location: "Vojvodina, Serbia",
      plantedArea: 500,
      expectedRevenue: 250000,
      harvestDate: "2024-10-15",
      funded: 150000,
      target: 175000,
      daysLeft: 45,
      investors: 12,
      status: "active",
    },
    {
      id: "2",
      cropType: "Corn",
      location: "Bačka, Serbia",
      plantedArea: 800,
      expectedRevenue: 320000,
      harvestDate: "2024-09-30",
      funded: 89000,
      target: 224000,
      daysLeft: 67,
      investors: 7,
      status: "active",
    },
  ],
  completedProjects: [
    {
      id: "3",
      cropType: "Wheat",
      location: "Banat, Serbia",
      plantedArea: 300,
      expectedRevenue: 150000,
      harvestDate: "2024-06-10",
      funded: 105000,
      target: 105000,
      investors: 9,
      status: "completed",
      fundsAvailable: 105000,
    },
  ],
};

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("investor");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = (item: any) => {
    setSelectedItem(item);
    setIsWithdrawModalOpen(true);
  };

  const handleViewDetails = (investment: any) => {
    setSelectedItem(investment);
    setIsDetailsModalOpen(true);
  };

  const handleWithdrawConfirm = async () => {
    setIsWithdrawing(true);
    // Simulate withdrawal process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsWithdrawing(false);
    setIsWithdrawModalOpen(false);
    // In a real app, you would update the state to reflect the withdrawal
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Portfolio Dashboard
            </h1>
            <p className="text-gray-300">
              Manage your investments and farming projects
            </p>
          </div>

          <Tabs
            defaultValue="investor"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-8 bg-gray-800">
              <TabsTrigger
                value="investor"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Investor View
              </TabsTrigger>
              <TabsTrigger
                value="farmer"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              >
                <Tractor className="w-4 h-4 mr-2" />
                Farmer View
              </TabsTrigger>
            </TabsList>

            {/* Investor View */}
            <TabsContent value="investor" className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Total Invested</p>
                    <p className="text-xl font-bold text-white">
                      ${investorData.stats.totalInvested.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Total Earned</p>
                    <p className="text-xl font-bold text-green-400">
                      ${investorData.stats.totalEarned.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Active Investments</p>
                    <p className="text-xl font-bold text-white">
                      {investorData.stats.activeInvestments}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Completed</p>
                    <p className="text-xl font-bold text-white">
                      {investorData.stats.completedInvestments}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Average APY</p>
                    <p className="text-xl font-bold text-white">
                      {investorData.stats.averageAPY}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Investments */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                  Active Investments
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {investorData.activeInvestments.map((investment) => (
                    <Card
                      key={investment.id}
                      className="bg-gray-800/50 border-gray-700"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white text-lg">
                              {investment.farmer}
                            </CardTitle>
                            <p className="text-gray-400 text-sm">
                              {investment.location}
                            </p>
                          </div>
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            Active
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-400 font-semibold">
                            {investment.cropType}
                          </span>
                          <span className="text-sm text-gray-400 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(
                              investment.harvestDate
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">
                              Growth Progress
                            </span>
                            <span className="text-white">
                              {investment.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${investment.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-400">Invested</p>
                            <p className="text-white font-semibold">
                              ${investment.investedAmount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Expected Return</p>
                            <p className="text-green-400 font-semibold">
                              ${investment.expectedReturn.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">APY</p>
                            <p className="text-yellow-400 font-semibold">
                              {investment.apy}%
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Days Left</p>
                            <p className="text-white font-semibold">
                              {investment.daysLeft}
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                          onClick={() => handleViewDetails(investment)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Completed Investments */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  Completed Investments
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {investorData.completedInvestments.map((investment) => (
                    <Card
                      key={investment.id}
                      className="bg-gray-800/50 border-gray-700"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white text-lg">
                              {investment.farmer}
                            </CardTitle>
                            <p className="text-gray-400 text-sm">
                              {investment.location}
                            </p>
                          </div>
                          <Badge
                            className={
                              investment.status === "available"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                            }
                          >
                            {investment.status === "available"
                              ? "Available"
                              : "Withdrawn"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-400 font-semibold">
                            {investment.cropType}
                          </span>
                          <span className="text-sm text-gray-400 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(
                              investment.completedDate
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-400">Invested</p>
                            <p className="text-white font-semibold">
                              ${investment.investedAmount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Returned</p>
                            <p className="text-green-400 font-semibold">
                              ${investment.returnedAmount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Profit</p>
                            <p className="text-green-400 font-semibold">
                              +${investment.profit.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">APY</p>
                            <p className="text-yellow-400 font-semibold">
                              {investment.apy}%
                            </p>
                          </div>
                        </div>

                        {investment.status === "available" ? (
                          <Button
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                            onClick={() => handleWithdraw(investment)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Withdraw Funds
                          </Button>
                        ) : (
                          <div className="text-center text-sm text-gray-400 p-2 bg-gray-800 rounded-md">
                            Withdrawn on{" "}
                            {investment.withdrawDate ? new Date(
                              investment.withdrawDate
                            ).toLocaleDateString() : '-'}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Farmer View */}
            <TabsContent value="farmer" className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Total Raised</p>
                    <p className="text-xl font-bold text-white">
                      ${farmerData.stats.totalRaised.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Coins className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Total Projects</p>
                    <p className="text-xl font-bold text-white">
                      {farmerData.stats.totalProjects}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Active Projects</p>
                    <p className="text-xl font-bold text-white">
                      {farmerData.stats.activeProjects}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Completed</p>
                    <p className="text-xl font-bold text-white">
                      {farmerData.stats.completedProjects}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Avg. Interest</p>
                    <p className="text-xl font-bold text-white">
                      {farmerData.stats.averageInterestRate}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Projects */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                  Active Projects
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {farmerData.activeProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="bg-gray-800/50 border-gray-700"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-white text-lg capitalize">
                            {project.cropType} Project
                          </CardTitle>
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            Active
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {project.location}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Planted Area</p>
                            <p className="text-white font-semibold">
                              {project.plantedArea} hectares
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Expected Revenue</p>
                            <p className="text-white font-semibold">
                              ${project.expectedRevenue.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Harvest Date</p>
                            <p className="text-white font-semibold flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(
                                project.harvestDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Days Left</p>
                            <p className="text-white font-semibold">
                              {project.daysLeft}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">
                              Funding Progress
                            </span>
                            <span className="text-white">
                              ${project.funded.toLocaleString()} / $
                              {project.target.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${
                                  (project.funded / project.target) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">
                            {project.investors}{" "}
                            {project.investors === 1 ? "investor" : "investors"}
                          </span>
                          <span className="text-yellow-400 font-semibold">
                            {((project.funded / project.target) * 100).toFixed(
                              0
                            )}
                            % funded
                          </span>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                          asChild
                        >
                          <a href={`/project/${project.id}`}>
                            View Project Details
                            <ArrowUpRight className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Completed Projects */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  Completed Projects
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {farmerData.completedProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="bg-gray-800/50 border-gray-700"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-white text-lg capitalize">
                            {project.cropType} Project
                          </CardTitle>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Completed
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {project.location}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Planted Area</p>
                            <p className="text-white font-semibold">
                              {project.plantedArea} hectares
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Revenue</p>
                            <p className="text-white font-semibold">
                              ${project.expectedRevenue.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Harvest Date</p>
                            <p className="text-white font-semibold flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(
                                project.harvestDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Investors</p>
                            <p className="text-white font-semibold">
                              {project.investors}
                            </p>
                          </div>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-green-400 font-semibold">
                                Funds Available
                              </p>
                              <p className="text-gray-300 text-sm">
                                ${project.fundsAvailable.toLocaleString()} USDC
                                available to withdraw
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button
                          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                          onClick={() => handleWithdraw(project)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Withdraw Funds
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        item={selectedItem}
        isInvestor={activeTab === "investor"}
        isProcessing={isWithdrawing}
        onConfirm={handleWithdrawConfirm}
      />

      {/* Investment Details Modal */}
      <InvestmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        investment={selectedItem}
      />
    </div>
  );
}
