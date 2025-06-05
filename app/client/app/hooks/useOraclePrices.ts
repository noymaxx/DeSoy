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

// For development, use mock data if no provider is available
const MOCK_PRICES: Price[] = [
  {
    asset: "corn",
    priceInCents: 543,
    lastUpdated: new Date()
  },
  {
    asset: "wheat",
    priceInCents: 725,
    lastUpdated: new Date()
  },
  {
    asset: "soybean",
    priceInCents: 1432,
    lastUpdated: new Date()
  },
  {
    asset: "coffee",
    priceInCents: 2150,
    lastUpdated: new Date()
  }
];

export const useOraclePrices = (assets: string[]) => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!process.env.NEXT_PUBLIC_RPC_URL || !process.env.NEXT_PUBLIC_ORACLE_ADDRESS) {
          console.log('Using mock data due to missing environment variables');
          setPrices(MOCK_PRICES);
          setLoading(false);
          return;
        }

        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        const oracle = new ethers.Contract(
          process.env.NEXT_PUBLIC_ORACLE_ADDRESS as string,
          ORACLE_ABI,
          provider
        );

        console.log('Fetching prices for assets:', assets);

        const pricePromises = assets.map(async (asset) => {
          const [price, timestamp] = await oracle.getPrice(asset);
          return {
            asset,
            priceInCents: Number(price),
            lastUpdated: new Date(Number(timestamp) * 1000)
          };
        });

        const fetchedPrices = await Promise.all(pricePromises);
        console.log('Fetched prices:', fetchedPrices);
        setPrices(fetchedPrices);
      } catch (err: any) {
        console.error('Failed to fetch prices:', err);
        // Fallback to mock data in case of error
        console.log('Falling back to mock data');
        setPrices(MOCK_PRICES);
        setError(err.message || 'Failed to fetch prices');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    
    // Set up an interval to fetch prices periodically
    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, [assets]);

  return { prices, loading, error };
}; 