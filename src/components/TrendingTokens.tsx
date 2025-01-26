'use client';

import { motion } from 'framer-motion';
import { ArrowRightIcon, TrendingUpIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';

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

export default function TrendingTokens({ tokens, onViewAll }: TrendingTokensProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <TrendingUpIcon className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold dark:text-white text-gray-900">
            Trending Tokens
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewAll}
          className="flex items-center gap-2 px-4 py-2 rounded-lg 
            dark:bg-blue-500/10 bg-blue-50 
            dark:text-blue-400 text-blue-600
            hover:bg-blue-500/20 dark:hover:bg-blue-500/20 
            transition-colors duration-200"
        >
          View All
          <ArrowRightIcon className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Scroll Container */}
      <div className="relative group">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10
            w-10 h-10 rounded-full 
            dark:bg-gray-800/90 bg-white/90 
            dark:text-gray-300 text-gray-700
            dark:hover:bg-gray-700 hover:bg-gray-100
            dark:border-gray-600 border-gray-200
            border shadow-lg 
            flex items-center justify-center
            transition-opacity duration-200
            opacity-0 group-hover:opacity-100"
        >
          <ArrowRightIcon className="w-5 h-5 rotate-180" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10
            w-10 h-10 rounded-full 
            dark:bg-gray-800/90 bg-white/90 
            dark:text-gray-300 text-gray-700
            dark:hover:bg-gray-700 hover:bg-gray-100
            dark:border-gray-600 border-gray-200
            border shadow-lg 
            flex items-center justify-center
            transition-opacity duration-200
            opacity-0 group-hover:opacity-100"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </button>

        {/* Tokens Scroll Area */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 px-4 sm:px-6 lg:px-8 pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {tokens.map((token) => (
            <motion.div
              key={token.address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="flex-none w-[300px] scroll-snap-align-start"
            >
              <div className="p-4 rounded-xl dark:bg-gray-800/50 bg-white/50 backdrop-blur-lg 
                border dark:border-gray-700/50 border-gray-200/50 
                dark:hover:border-blue-500/50 hover:border-blue-500/50
                transition-all duration-200 shadow-lg"
              >
                {/* Token Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold dark:text-white text-gray-900">
                      {token.name}
                    </h3>
                    <p className="text-sm dark:text-gray-400 text-gray-600">
                      {token.symbol}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold dark:text-white text-gray-900">
                      ${token.price.toLocaleString()}
                    </p>
                    <p className={`text-sm ${
                      token.change24h >= 0 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Token Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs dark:text-gray-400 text-gray-600 mb-1">
                      24h Volume
                    </p>
                    <p className="text-sm font-medium dark:text-white text-gray-900">
                      ${(token.volume24h / 1e6).toFixed(2)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs dark:text-gray-400 text-gray-600 mb-1">
                      Market Cap
                    </p>
                    <p className="text-sm font-medium dark:text-white text-gray-900">
                      ${(token.marketCap / 1e6).toFixed(2)}M
                    </p>
                  </div>
                </div>

                {/* Popularity */}
                <div className="mt-4 pt-4 border-t dark:border-gray-700/50 border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <p className="text-xs dark:text-gray-400 text-gray-600">
                      Popularity
                    </p>
                    <p className="text-sm font-medium dark:text-white text-gray-900">
                      {token.votes.toLocaleString()} votes
                    </p>
                  </div>
                  <div className="mt-2 h-2 rounded-full dark:bg-gray-700/50 bg-gray-200/50 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${Math.min((token.votes / 1000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 