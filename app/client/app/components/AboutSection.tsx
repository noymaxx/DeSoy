"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "I invested in a Serbian raspberry farm and earned 15% APY with full transparency.",
    author: "Sarah Chen",
    role: "DeFi Investor",
  },
  {
    quote: "I got funding for my wheat crop without bank friction, and it was fast.",
    author: "Marko Petrović",
    role: "Farmer",
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">About deSoy</h2>
            <div className="space-y-6 text-gray-100 text-lg leading-relaxed">
              <p>
                deSoy's mission is to unlock real value from agriculture using DeFi. By connecting global capital with
                underfunded yet productive farmers, we decentralize access to credit while creating inflation-resistant
                yield for anyone, anywhere.
              </p>
              <p>
                Our initial launch focuses on <strong className="text-yellow-400">Serbia and the Balkans</strong> — a
                region with strong agricultural output and limited access to transparent financing.
              </p>
              <p>
                Through cutting-edge Web3 technologies, we're building the future of agricultural finance, where
                transparency, efficiency, and fair returns are the standard, not the exception.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/50 backdrop-blur-md border-gray-700">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-yellow-400 mb-4" />
                  <blockquote className="text-gray-100 text-lg mb-4 italic">"{testimonial.quote}"</blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold mr-3">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.author}</div>
                      <div className="text-yellow-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
