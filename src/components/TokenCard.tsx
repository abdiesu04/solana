import { motion } from 'framer-motion';
import { useState } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { 
  StarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
  PlusIcon as PlusIconSolid
} from '@heroicons/react/24/solid';
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
    votes: number;
    isPinned?: boolean;
    reactions?: {
      rocket: number;
      fire: number;
    };
    isFavorite?: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
  onPin: (address: string) => void;
  onVote: (address: string) => void;
  onReaction: (address: string, reaction: 'rocket' | 'fire') => void;
  onFavorite: (address: string) => void;
}

export default function TokenCard({ 
  token, 
  isSelected, 
  onClick, 
  onPin,
  onVote,
  onReaction, 
  onFavorite 
}: TokenCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const chartData = Array.from({ length: 20 }, () => ({
    value: token.price * (0.95 + Math.random() * 0.1),
  }));

  const handleClick = () => {
    setIsDetailOpen(true);
    onClick();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`relative group cursor-pointer ${
          isSelected ? 'ring-2 ring-solana-purple' : ''
        } ${token.isPinned ? 'border-2 border-solana-green/50' : ''}`}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-solana-purple/20 to-solana-green/20 rounded-xl blur-xl transition-opacity duration-300 ${
          isHovered || token.isPinned ? 'opacity-100' : 'opacity-0'
        }`} />
        
        <div className="h-[280px] rounded-xl glass border border-gray-700/50 relative overflow-hidden transition-all duration-300">
          {/* Pin Button */}
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation();
              onPin(token.address);
            }}
            className={`absolute top-2 right-2 z-10 p-1.5 rounded-full 
              ${token.isPinned 
                ? 'bg-yellow-400/20 text-yellow-400' 
                : 'bg-gray-800/50 text-gray-400 hover:text-yellow-400 hover:bg-gray-700/50'}`}
          >
            {token.isPinned ? (
              <PlusIconSolid className="w-4 h-4 rotate-45" />
            ) : (
              <PlusIcon className="w-4 h-4 rotate-45" />
            )}
          </motion.button>

          {/* Main content */}
          <div className="flex flex-col h-full" onClick={handleClick}>
            {/* Header */}
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

            {/* Chart */}
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

            {/* Footer */}
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

              {/* Actions */}
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2">
                  {/* Vote Button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onVote(token.address);
                    }}
                    className="flex items-center gap-1 text-sm bg-gray-800/50 px-3 py-1.5 rounded-md hover:bg-gray-700/50 transition-colors"
                  >
                    <StarIcon className="w-4 h-4" />
                    <span>{token.votes || 0}</span>
                  </motion.button>
                  
                  {/* Reactions */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReaction(token.address, 'rocket');
                    }}
                    className="text-sm bg-gray-800/50 px-2 py-1 rounded-md hover:bg-gray-700/50"
                  >
                    🚀 {token.reactions?.rocket || 0}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReaction(token.address, 'fire');
                    }}
                    className="text-sm bg-gray-800/50 px-2 py-1 rounded-md hover:bg-gray-700/50"
                  >
                    🔥 {token.reactions?.fire || 0}
                  </motion.button>
                </div>
                
                {/* Favorite Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavorite(token.address);
                  }}
                  className={`p-1.5 rounded-full transition-colors ${
                    token.isFavorite 
                      ? 'text-yellow-400 bg-yellow-400/20' 
                      : 'text-gray-400 hover:text-yellow-400'
                  }`}
                >
                  {token.isFavorite ? (
                    <StarIconSolid className="w-4 h-4" />
                  ) : (
                    <StarIcon className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
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