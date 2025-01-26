'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';
import { Token } from '@/types/token';
import { coingeckoService } from '@/services/coingecko';

interface TrendingToken {
  address: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  votes: number;
}

interface TrendingTokensProps {
  tokens: TrendingToken[];
  onViewAll: () => void;
}

export default function TrendingTokens() {
  const [trendingTokens, setTrendingTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const tokens = await coingeckoService.getTrendingTokens();
        setTrendingTokens(tokens.slice(0, 5)); // Only show top 5
      } catch (error) {
        console.error('Error fetching trending tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
    // Refresh every 5 minutes
    const interval = setInterval(fetchTrending, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-gray-900 border-b border-gray-800 py-2 px-4">
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 py-2 overflow-hidden">
      <div className="flex items-center space-x-6 animate-scroll px-4">
        {trendingTokens.map((token) => (
          <div key={token.id} className="flex items-center space-x-2 min-w-fit">
            <img src={token.image} alt={token.name} className="w-5 h-5 rounded-full" />
            <span className="text-sm font-medium text-gray-200">{token.symbol}</span>
            <span className={`text-sm ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 