"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, BarChart3, Brain, Lock, Globe, DollarSign } from "lucide-react"

const benefits = [
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Verified Farmers via Civic",
    description: "Identity verification ensures only legitimate farmers can access funding",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Real-World Yield, Not Speculation",
    description: "Returns backed by actual agricultural production, not market speculation",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Automated Risk Checks",
    description: "Chainlink oracles validate weather, licensing, and production data",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Smart Contract Settlement",
    description: "Automated execution on Flare Network ensures transparent, trustless operations",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Access to Local Agriculture",
    description: "Connect with farming opportunities worldwide from anywhere",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Transparent Returns, No Middlemen",
    description: "Direct peer-to-peer financing eliminates traditional banking fees",
  },
]

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 bg-gray-900/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Choose deSoy?</h2>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Experience the benefits of decentralized agricultural finance
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700 hover:border-yellow-500/50 transition-all duration-300 h-full group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                      <div className="text-yellow-400">{benefit.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-100 text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
