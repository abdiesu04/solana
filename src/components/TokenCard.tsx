import { motion } from 'framer-motion';
import { useState } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import TokenDetailModal from './TokenDetailModal';

interface TokenCardProps {
  token: {
    address: string;
    name: string;
    symbol: string;
    price: number;
    marketCap: number;
    volume24h: number;
    change24h: number;
    reactions?: {
      rocket: number;
      fire: number;
      poop: number;
    };
    isFavorite?: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
  onReaction: (address: string, reaction: 'rocket' | 'fire' | 'poop') => void;
  onFavorite: (address: string) => void;
}

export default function TokenCard({ token, isSelected, onClick, onReaction, onFavorite }: TokenCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  // Generate smooth price data based on current price
  const chartData = Array.from({ length: 20 }, () => ({
    value: token.price * (0.95 + Math.random() * 0.1),
  }));

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        onClick={onClick}
        className={`relative group cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="h-[280px] rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 relative overflow-hidden group-hover:border-blue-500/50 transition-all duration-300">
          {/* Main content container with proper spacing */}
          <div className="flex flex-col h-full">
            {/* Header section */}
            <div className="p-4 border-b border-gray-700/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 truncate max-w-[150px]">
                    {token.name}
                  </h3>
                  <p className="text-sm text-gray-400">{token.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">
                    ${token.price.toLocaleString()}
                  </p>
                  <p className={`text-sm ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Chart section */}
            <div className="flex-1 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={token.change24h >= 0 ? '#22c55e' : '#ef4444'}
                    fill={`url(#gradient-${token.address})`}
                  />
                  <defs>
                    <linearGradient id={`gradient-${token.address}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={token.change24h >= 0 ? '#22c55e' : '#ef4444'}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="100%"
                        stopColor={token.change24h >= 0 ? '#22c55e' : '#ef4444'}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Footer section */}
            <div className="p-4 border-t border-gray-700/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Market Cap</p>
                  <p className="text-sm text-white font-medium">
                    ${(token.marketCap / 1e6).toFixed(2)}M
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Volume 24h</p>
                  <p className="text-sm text-white font-medium">
                    ${(token.volume24h / 1e6).toFixed(2)}M
                  </p>
                </div>
              </div>

              {/* Reactions and actions */}
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReaction(token.address, 'rocket');
                    }}
                    className="text-sm bg-gray-800/50 px-2 py-1 rounded-md hover:bg-gray-700/50"
                  >
                    🚀 {token.reactions?.rocket || 0}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReaction(token.address, 'fire');
                    }}
                    className="text-sm bg-gray-800/50 px-2 py-1 rounded-md hover:bg-gray-700/50"
                  >
                    🔥 {token.reactions?.fire || 0}
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavorite(token.address);
                  }}
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  {token.isFavorite ? '★' : '☆'}
                </button>
              </div>
            </div>
          </div>

          {/* Clickable overlay */}
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={onClick}
            aria-label={`View details for ${token.name}`}
          />
        </div>
      </motion.div>

      <TokenDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        token={token}
      />
    </>
  );
} 