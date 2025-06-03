"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

const technologies = [
  {
    name: "Flare Network",
    description: "Smart contract execution and APY disbursement",
    logo: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Chainlink",
    description: "Oracle network for off-chain data validation",
    logo: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Civic",
    description: "Identity verification for farmers and investors",
    logo: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "IPFS",
    description: "Decentralized storage for contract metadata",
    logo: "/placeholder.svg?height=60&width=60",
  },
]

export default function TechSection() {
  return (
    <section id="tech" className="py-20 bg-gray-900/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Backed by Proven Technology</h2>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            deSoy is built on proven decentralized infrastructure for performance, transparency, and trust
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700 hover:border-yellow-500/50 transition-all duration-300 h-full group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                    <img src={tech.logo || "/placeholder.svg"} alt={`${tech.name} logo`} className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{tech.name}</h3>
                  <p className="text-gray-100 text-sm">{tech.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
