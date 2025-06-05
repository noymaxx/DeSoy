"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Wallet, Brain, Coffee, Wheat, Sprout } from "lucide-react";
import { useOraclePrices } from "../hooks/useOraclePrices";

const ASSETS = ["corn", "wheat", "soybean", "coffee"];

const getAssetIcon = (asset: string) => {
  switch (asset.toLowerCase()) {
    case 'corn':
      return <Brain className="w-5 h-5 text-yellow-400 mr-2" />;
    case 'wheat':
      return <Wheat className="w-5 h-5 text-yellow-400 mr-2" />;
    case 'coffee':
      return <Coffee className="w-5 h-5 text-yellow-400 mr-2" />;
    case 'soybean':
      return <Sprout className="w-5 h-5 text-yellow-400 mr-2" />;
    default:
      return <TrendingUp className="w-5 h-5 text-yellow-400 mr-2" />;
  }
};

export default function HeroSection() {
  const { prices, loading, error } = useOraclePrices(ASSETS);

  // Debug logs
  console.log('HeroSection Render:', { prices, loading, error });

  // Split prices into two rows
  const firstRowPrices = prices?.slice(0, 2) || [];
  const secondRowPrices = prices?.slice(2) || [];

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
            Earn high, stable returns by funding verified farmers through
            tokenized crop receivables. Real-world assets meet DeFi innovation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg"
              onClick={() => (window.location.href = "/marketplace")}
            >
              <Wallet className="w-5 h-5 mr-2" />
              Invest
            </Button>
            <Button
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg"
              onClick={() => (window.location.href = "/tokenize")}
            >
              <Wallet className="w-5 h-5 mr-2" />
              Tokenize Your Harvest
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 text-lg"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              How It Works
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Price Tickers and APY */}
          <div className="flex flex-col gap-4 items-center mb-8">
            {loading ? (
              // Loading skeletons in two rows
              <div className="grid grid-rows-2 gap-4 w-full">
                <div className="flex gap-4 justify-center">
                  {Array(2).fill(0).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i, duration: 0.6 }}
                      className="inline-flex items-center bg-gray-800/50 backdrop-blur-md rounded-full px-6 py-3 border border-yellow-500/30"
                    >
                      <TrendingUp className="w-5 h-5 text-yellow-400/50 mr-2" />
                      <div className="h-6 w-24 bg-gray-700/50 rounded animate-pulse"></div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-4 justify-center">
                  {Array(3).fill(0).map((_, i) => (
                    <motion.div
                      key={i + 2}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * (i + 2), duration: 0.6 }}
                      className="inline-flex items-center bg-gray-800/50 backdrop-blur-md rounded-full px-6 py-3 border border-yellow-500/30"
                    >
                      <TrendingUp className="w-5 h-5 text-yellow-400/50 mr-2" />
                      <div className="h-6 w-24 bg-gray-700/50 rounded animate-pulse"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : prices && prices.length > 0 ? (
              <div className="space-y-4">
                {/* Price Tickers Grid */}
                <div className="grid grid-rows-2 gap-4 w-full">
                  {/* First Row */}
                  <div className="flex gap-4 justify-center">
                    {firstRowPrices.map((price, index) => (
                      <motion.div
                        key={price.asset}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index, duration: 0.6 }}
                        className="inline-flex items-center bg-gray-800/50 backdrop-blur-md rounded-full px-6 py-3 border border-yellow-500/30"
                      >
                        {getAssetIcon(price.asset)}
                        <span className="text-gray-100 mr-2 capitalize">{price.asset}:</span>
                        <motion.span
                          className="text-2xl font-bold text-yellow-400"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          ${(price.priceInCents / 100).toFixed(2)}
                        </motion.span>
                      </motion.div>
                    ))}
                  </div>
                  {/* Second Row */}
                  <div className="flex gap-4 justify-center">
                    {secondRowPrices.map((price, index) => (
                      <motion.div
                        key={price.asset}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * (index + 2), duration: 0.6 }}
                        className="inline-flex items-center bg-gray-800/50 backdrop-blur-md rounded-full px-6 py-3 border border-yellow-500/30"
                      >
                        {getAssetIcon(price.asset)}
                        <span className="text-gray-100 mr-2 capitalize">{price.asset}:</span>
                        <motion.span
                          className="text-2xl font-bold text-yellow-400"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          ${(price.priceInCents / 100).toFixed(2)}
                        </motion.span>
                      </motion.div>
                    ))}
                    {/* APY Ticker */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="inline-flex items-center bg-gray-800/50 backdrop-blur-md rounded-full px-6 py-3 border border-yellow-500/30"
                    >
                      <TrendingUp className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-gray-100 mr-2">Average APY:</span>
                      <motion.span
                        className="text-2xl font-bold text-yellow-400"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        12.5%
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
                {/* Last Updated Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="text-center text-sm text-gray-400"
                >
                  <span>Prices from Oracle • Last updated: </span>
                  <span>
                    {prices[0]?.lastUpdated?.toLocaleTimeString()} {prices[0]?.lastUpdated?.toLocaleDateString()}
                  </span>
                </motion.div>
              </div>
            ) : error ? (
              // Error state
              <div className="text-red-400">Error loading prices: {error}</div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}