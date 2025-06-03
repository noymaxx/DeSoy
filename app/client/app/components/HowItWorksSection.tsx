"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Coins, Shield, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: <Coins className="w-8 h-8" />,
    title: "Tokenize",
    description:
      "Farmers log in with Civic Auth and tokenize future receivables (e.g., 100 tons of soy harvest in October).",
    color: "from-yellow-400 to-yellow-500",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Verify",
    description: "Chainlink Functions validate climate, licensing, and production estimates from external APIs.",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Invest & Earn",
    description:
      "Smart contracts on Flare automate funding and deliver high APY yields back to investors post-harvest.",
    color: "from-yellow-400 to-yellow-600",
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Three simple steps to connect global capital with productive farmers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700 hover:border-yellow-500/50 transition-all duration-300 h-full">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${step.color} mb-6`}>
                    <div className="text-black">{step.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Step {index + 1}: {step.title}
                  </h3>
                  <p className="text-gray-100 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Connection Lines */}
        <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl">
          <svg className="w-full h-4" viewBox="0 0 800 40">
            <motion.path
              d="M 100 20 Q 400 20 700 20"
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              viewport={{ once: true }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  )
}
