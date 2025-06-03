"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Calendar, TrendingUp, Coins, Clock, CheckCircle } from "lucide-react"
import DashboardHeader from "../components/DashboardHeader"

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

const mockProjects: CropProject[] = [
  {
    id: "1",
    farmer: "Marko Petrović",
    cropType: "Soy",
    location: "Vojvodina, Serbia",
    plantedArea: 500,
    expectedRevenue: 250000,
    harvestDate: "2024-10-15",
    apy: 12.5,
    funded: 150000,
    target: 175000,
    status: "active",
    riskScore: "low",
    daysLeft: 45,
  },
  {
    id: "2",
    farmer: "Ana Nikolić",
    cropType: "Raspberries",
    location: "Šumadija, Serbia",
    plantedArea: 25,
    expectedRevenue: 180000,
    harvestDate: "2024-07-20",
    apy: 15.2,
    funded: 126000,
    target: 126000,
    status: "funded",
    riskScore: "low",
    daysLeft: 0,
  },
  {
    id: "3",
    farmer: "Stefan Jovanović",
    cropType: "Corn",
    location: "Bačka, Serbia",
    plantedArea: 800,
    expectedRevenue: 320000,
    harvestDate: "2024-09-30",
    apy: 11.8,
    funded: 89000,
    target: 224000,
    status: "active",
    riskScore: "medium",
    daysLeft: 67,
  },
  {
    id: "4",
    farmer: "Milica Stojanović",
    cropType: "Wheat",
    location: "Banat, Serbia",
    plantedArea: 300,
    expectedRevenue: 150000,
    harvestDate: "2024-08-10",
    apy: 13.1,
    funded: 105000,
    target: 105000,
    status: "harvested",
    riskScore: "low",
    daysLeft: 0,
  },
]

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCrop, setFilterCrop] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.cropType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCrop = filterCrop === "all" || project.cropType.toLowerCase() === filterCrop
    const matchesStatus = filterStatus === "all" || project.status === filterStatus

    return matchesSearch && matchesCrop && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "funded":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "harvested":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
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
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Investment Marketplace</h1>
            <p className="text-gray-300">Discover and invest in tokenized agricultural projects</p>
          </div>

          {/* Filters */}
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by farmer, location, or crop..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                <Select value={filterCrop} onValueChange={setFilterCrop}>
                  <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Filter by crop" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all">All Crops</SelectItem>
                    <SelectItem value="soy">Soy</SelectItem>
                    <SelectItem value="corn">Corn</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="raspberries">Raspberries</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="funded">Funded</SelectItem>
                    <SelectItem value="harvested">Harvested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:border-yellow-500/50 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <CardTitle className="text-white text-lg">{project.farmer}</CardTitle>
                        <p className="text-gray-400 text-sm flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {project.location}
                        </p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-yellow-400 font-semibold text-lg">{project.cropType}</span>
                      <span className="text-sm text-gray-400">{project.plantedArea} hectares</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">APY</p>
                        <p className="text-yellow-400 font-semibold flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {project.apy}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Risk Score</p>
                        <p className={`font-semibold ${getRiskColor(project.riskScore)}`}>
                          {project.riskScore.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Funding Progress</span>
                        <span className="text-white">
                          ${project.funded.toLocaleString()} / ${project.target.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(project.funded / project.target) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(project.harvestDate).toLocaleDateString()}
                      </div>
                      {project.status === "active" && (
                        <div className="flex items-center text-yellow-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {project.daysLeft} days left
                        </div>
                      )}
                      {project.status === "harvested" && (
                        <div className="flex items-center text-green-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                      disabled={project.status !== "active"}
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      {project.status === "active"
                        ? "Invest Now"
                        : project.status === "funded"
                          ? "Fully Funded"
                          : "Completed"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No projects found matching your criteria</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
