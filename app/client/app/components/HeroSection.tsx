"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Wallet } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/50"></div>
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <motion.div
              key={i}
              className="border border-yellow-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 3,
                delay: i * 0.02,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              Grow Capital.
            </span>
            <br />
            <span className="text-white">Fuel Agriculture.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Earn high, stable returns by funding verified farmers through tokenized crop receivables. Real-world assets
            meet DeFi innovation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg">
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 text-lg"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              How It Works
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* APY Ticker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="inline-flex items-center bg-gray-800/50 backdrop-blur-md rounded-full px-6 py-3 border border-yellow-500/30"
          >
            <TrendingUp className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-gray-100 mr-2">Current APY:</span>
            <motion.span
              className="text-2xl font-bold text-yellow-400"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              12.5%
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
