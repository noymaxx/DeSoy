import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ORACLE_ABI = [
  "function getPrice(string memory commodity) external view returns (uint256, uint256)"
];

interface Price {
  asset: string;
  priceInCents: number;
  lastUpdated: Date;
}

export const useOraclePrices = (assets: string[]) => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Connect to provider (you might want to use your web3 provider here)
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        const oracle = new ethers.Contract(
          process.env.NEXT_PUBLIC_ORACLE_ADDRESS as string,
          ORACLE_ABI,
          provider
        );

        // Fetch prices for all assets
        const pricePromises = assets.map(async (asset) => {
          const [price, timestamp] = await oracle.getPrice(asset);
          return {
            asset,
            priceInCents: Number(price),
            lastUpdated: new Date(Number(timestamp) * 1000)
          };
        });

        const fetchedPrices = await Promise.all(pricePromises);
        setPrices(fetchedPrices);
      } catch (err: any) {
        console.error('Failed to fetch prices:', err);
        setError(err.message || 'Failed to fetch prices');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    
    // Set up an interval to fetch prices periodically (e.g., every minute)
    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, [assets]);

  return { prices, loading, error };
}; 