"use client";

import { useOraclePrices } from "../hooks/useOraclePrices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp } from "lucide-react";

const ASSETS = ["corn", "wheat", "soybean", "coffee"];

export default function PriceDisplay() {
  const { prices, loading, error } = useOraclePrices(ASSETS);

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <p className="text-red-400">Error loading prices: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {loading ? (
        Array(4).fill(0).map((_, i) => (
          <Card key={i} className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
            </CardContent>
          </Card>
        ))
      ) : (
        prices.map((price) => (
          <Card key={price.asset} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-lg capitalize">
                <TrendingUp className="w-4 h-4 mr-2 text-yellow-400" />
                {price.asset}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-yellow-400">
                  ${(price.priceInCents / 100).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  Last updated: {price.lastUpdated.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
} 