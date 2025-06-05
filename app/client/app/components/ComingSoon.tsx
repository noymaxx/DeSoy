"use client";

import { motion } from "framer-motion";
import { Construction, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ComingSoon() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <div className="relative">
          <Construction className="w-24 h-24 mx-auto text-yellow-400 mb-6" />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 right-1/3"
          >
            <Rocket className="w-8 h-8 text-yellow-400" />
          </motion.div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          Under Construction
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          We're building something amazing! This feature will be available soon.
          Stay tuned for updates.
        </p>

        <div className="space-x-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            Go Back
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="bg-yellow-400 text-black hover:bg-yellow-500"
          >
            Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 