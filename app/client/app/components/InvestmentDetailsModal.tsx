"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Calendar,
  TrendingUp,
  Coins,
  Clock,
  Thermometer,
  Droplets,
  Sun,
  Shield,
  FileText,
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Download,
} from "lucide-react";

interface InvestmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment: any;
}

// Mock detailed data for the investment
const getInvestmentDetails = (investment: any) => ({
  ...investment,
  description:
    "High-quality soy cultivation using sustainable farming practices with precision agriculture technology.",
  riskScore: "low",
  weatherData: {
    temperature: 24,
    humidity: 65,
    rainfall: 45,
    forecast: "Favorable conditions for crop development",
  },
  milestones: [
    {
      date: "2024-03-15",
      title: "Planting Completed",
      status: "completed",
      description: "Seeds planted across 500 hectares",
    },
    {
      date: "2024-05-20",
      title: "First Growth Check",
      status: "completed",
      description: "Healthy germination rate of 95%",
    },
    {
      date: "2024-07-10",
      title: "Mid-Season Assessment",
      status: "completed",
      description: "Crop development on track",
    },
    {
      date: "2024-08-25",
      title: "Pre-Harvest Inspection",
      status: "current",
      description: "Quality assessment and yield estimation",
    },
    {
      date: "2024-10-15",
      title: "Harvest & Settlement",
      status: "pending",
      description: "Crop harvest and investor payouts",
    },
  ],
  documents: [
    { name: "Land Ownership Certificate", type: "Legal", verified: true },
    { name: "Crop Insurance Policy", type: "Insurance", verified: true },
    { name: "Soil Analysis Report", type: "Technical", verified: true },
    { name: "Weather Station Data", type: "Environmental", verified: true },
    { name: "Farming License", type: "Legal", verified: true },
  ],
  farmerProfile: {
    name: "Marko Petrović",
    experience: "15 years",
    totalProjects: 8,
    successRate: 95,
    rating: 4.8,
    location: "Vojvodina, Serbia",
    specialization: "Soy and Corn cultivation",
    certifications: ["Organic Farming", "Precision Agriculture"],
  },
  financialBreakdown: {
    principalAmount: 15000,
    expectedInterest: 1875,
    platformFee: 375,
    netReturn: 16500,
    dailyAccrual: 1.37,
  },
  marketData: {
    currentSoyPrice: 485,
    priceChange: +2.3,
    marketTrend: "bullish",
    demandLevel: "high",
  },
});

export default function InvestmentDetailsModal({
  isOpen,
  onClose,
  investment,
}: InvestmentDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!investment) return null;

  const details = getInvestmentDetails(investment);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "high":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "current":
        return "text-yellow-400";
      case "pending":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "current":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-white flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-yellow-400" />
            Investment Details - {details.farmer}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto pr-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <TabsList className="grid grid-cols-4 mb-4 bg-gray-800 flex-shrink-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              >
                Progress
              </TabsTrigger>
              <TabsTrigger
                value="farmer"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              >
                Farmer
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              >
                Documents
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto pr-2">
              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* Investment Summary */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="flex items-center">
                        <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                        Investment Summary
                      </span>
                      <Badge className={getRiskColor(details.riskScore)}>
                        {details.riskScore.toUpperCase()} RISK
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-yellow-400 font-semibold mb-2">
                            Project Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Crop Type:</span>
                              <span className="text-white font-semibold">
                                {details.cropType}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Location:</span>
                              <span className="text-white flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {details.location}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Planted Area:
                              </span>
                              <span className="text-white">
                                {details.plantedArea || "500"} hectares
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Harvest Date:
                              </span>
                              <span className="text-white flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(
                                  details.harvestDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-yellow-400 font-semibold mb-2">
                            Financial Overview
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Principal Amount:
                              </span>
                              <span className="text-white font-semibold">
                                $
                                {details.financialBreakdown.principalAmount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Expected Interest:
                              </span>
                              <span className="text-green-400 font-semibold">
                                +$
                                {details.financialBreakdown.expectedInterest.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Platform Fee:
                              </span>
                              <span className="text-red-400">
                                -$
                                {details.financialBreakdown.platformFee.toLocaleString()}
                              </span>
                            </div>
                            <div className="border-t border-gray-700 pt-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400">
                                  Net Return:
                                </span>
                                <span className="text-yellow-400 font-bold">
                                  $
                                  {details.financialBreakdown.netReturn.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-yellow-400 font-semibold mb-2">
                            Current Status
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">
                                  Growth Progress
                                </span>
                                <span className="text-white">
                                  {details.progress}%
                                </span>
                              </div>
                              <Progress
                                value={details.progress}
                                className="h-2"
                              />
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">
                                Days Remaining:
                              </span>
                              <span className="text-white font-semibold">
                                {details.daysLeft} days
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">
                                Daily Accrual:
                              </span>
                              <span className="text-green-400 font-semibold">
                                +${details.financialBreakdown.dailyAccrual}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-yellow-400 font-semibold mb-2">
                            Market Data
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Current Soy Price:
                              </span>
                              <span className="text-white">
                                ${details.marketData.currentSoyPrice}/ton
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">24h Change:</span>
                              <span className="text-green-400">
                                +{details.marketData.priceChange}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Market Trend:
                              </span>
                              <span className="text-green-400 capitalize">
                                {details.marketData.marketTrend}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Demand Level:
                              </span>
                              <span className="text-yellow-400 capitalize">
                                {details.marketData.demandLevel}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <h4 className="text-yellow-400 font-semibold mb-2">
                        Project Description
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {details.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Weather Conditions */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Sun className="w-5 h-5 mr-2 text-yellow-400" />
                      Current Weather Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <Thermometer className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">
                          {details.weatherData.temperature}°C
                        </p>
                        <p className="text-gray-400 text-sm">Temperature</p>
                      </div>
                      <div className="text-center">
                        <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">
                          {details.weatherData.humidity}%
                        </p>
                        <p className="text-gray-400 text-sm">Humidity</p>
                      </div>
                      <div className="text-center">
                        <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">
                          {details.weatherData.rainfall}mm
                        </p>
                        <p className="text-gray-400 text-sm">
                          Monthly Rainfall
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-400 text-sm font-semibold">
                        Weather Forecast
                      </p>
                      <p className="text-gray-300 text-sm">
                        {details.weatherData.forecast}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6 mt-0">
                {/* Project Timeline */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                      Project Timeline & Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {details.milestones.map(
                        (milestone: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-start space-x-4"
                          >
                            <div
                              className={`flex-shrink-0 p-2 rounded-full ${
                                milestone.status === "completed"
                                  ? "bg-green-500/20"
                                  : milestone.status === "current"
                                  ? "bg-yellow-500/20"
                                  : "bg-gray-500/20"
                              }`}
                            >
                              <div className={getStatusColor(milestone.status)}>
                                {getStatusIcon(milestone.status)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-white font-semibold">
                                  {milestone.title}
                                </h4>
                                <span className="text-gray-400 text-sm">
                                  {new Date(
                                    milestone.date
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm mt-1">
                                {milestone.description}
                              </p>
                              {milestone.status === "current" && (
                                <div className="mt-2">
                                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                    In Progress
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Growth Analytics */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
                      Growth Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-yellow-400 font-semibold mb-3">
                          Crop Development
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">
                                Germination Rate
                              </span>
                              <span className="text-green-400">95%</span>
                            </div>
                            <Progress value={95} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">
                                Plant Height
                              </span>
                              <span className="text-green-400">
                                85cm (Target: 90cm)
                              </span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">
                                Pod Formation
                              </span>
                              <span className="text-yellow-400">70%</span>
                            </div>
                            <Progress value={70} className="h-2" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-yellow-400 font-semibold mb-3">
                          Yield Projection
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Expected Yield:
                            </span>
                            <span className="text-white">3.2 tons/hectare</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Total Expected:
                            </span>
                            <span className="text-white">1,600 tons</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Market Value:</span>
                            <span className="text-green-400">$776,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Quality Grade:
                            </span>
                            <span className="text-yellow-400">Premium</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="farmer" className="space-y-6 mt-0">
                {/* Farmer Profile */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Users className="w-5 h-5 mr-2 text-yellow-400" />
                      Farmer Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xl">
                            {details.farmerProfile.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {details.farmerProfile.name}
                            </h3>
                            <p className="text-gray-400">
                              {details.farmerProfile.specialization}
                            </p>
                            <div className="flex items-center mt-1">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={
                                      i <
                                      Math.floor(details.farmerProfile.rating)
                                        ? "★"
                                        : "☆"
                                    }
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-gray-400 text-sm ml-2">
                                ({details.farmerProfile.rating}/5)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Experience:</span>
                            <span className="text-white">
                              {details.farmerProfile.experience}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Total Projects:
                            </span>
                            <span className="text-white">
                              {details.farmerProfile.totalProjects}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Success Rate:</span>
                            <span className="text-green-400">
                              {details.farmerProfile.successRate}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Location:</span>
                            <span className="text-white">
                              {details.farmerProfile.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-yellow-400 font-semibold mb-2">
                            Certifications
                          </h4>
                          <div className="space-y-2">
                            {details.farmerProfile.certifications.map(
                              (cert: string, index: number) => (
                                <Badge
                                  key={index}
                                  className="bg-green-500/20 text-green-400 border-green-500/30 mr-2"
                                >
                                  <Shield className="w-3 h-3 mr-1" />
                                  {cert}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-yellow-400 font-semibold mb-2">
                            Track Record
                          </h4>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">
                                  On-time Delivery
                                </span>
                                <span className="text-green-400">100%</span>
                              </div>
                              <Progress value={100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">
                                  Quality Standards
                                </span>
                                <span className="text-green-400">98%</span>
                              </div>
                              <Progress value={98} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">
                                  Investor Satisfaction
                                </span>
                                <span className="text-green-400">96%</span>
                              </div>
                              <Progress value={96} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6 mt-0">
                {/* Document Verification */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-yellow-400" />
                      Document Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {details.documents.map((doc: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-yellow-400" />
                            <div>
                              <p className="text-white font-semibold">
                                {doc.name}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {doc.type}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {doc.verified ? (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-green-400 font-semibold">
                            All Documents Verified
                          </p>
                          <p className="text-gray-300 text-sm">
                            All required documents have been verified by
                            Chainlink oracles and meet platform standards.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Blockchain Verification */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-yellow-400" />
                      Blockchain Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">
                          Smart Contract Address
                        </p>
                        <p className="text-white font-mono text-sm">
                          0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          Transaction Hash
                        </p>
                        <p className="text-white font-mono text-sm">
                          0x8f3b2c1a9e7d6f5c4b3a2e1d9c8b7a6f5e4d3c2b1a
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Blockchain Explorer
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t border-gray-700 pt-4 mt-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Close
            </Button>
            <Button
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              asChild
            >
              <a href={`/marketplace/${investment.id}`}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Project
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
