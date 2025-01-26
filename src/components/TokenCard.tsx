import { motion } from 'framer-motion';
import { FaRocket, FaFire, FaPoop, FaStar } from 'react-icons/fa';
import { formatNumber, formatPercentage } from '@/utils/format';
import { useState, useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { 
  StarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
  PlusIcon as PlusIconSolid
} from '@heroicons/react/24/solid';

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
      poop: number;
    };
    isFavorite?: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
  onPin: (address: string) => void;
  onVote: (address: string) => void;
  onReaction: (address: string, reaction: 'rocket' | 'fire' | 'poop') => void;
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
  
  // Generate simple chart data
  const chartData = useMemo(() => {
    const data = [];
    const points = 20;
    const basePrice = token.price;
    const volatility = basePrice * 0.05;
    const trend = token.change24h >= 0 ? 0.3 : -0.3;

    for (let i = 0; i < points; i++) {
      const random = (Math.random() - 0.5) * volatility;
      const trendEffect = (trend * volatility * i) / points;
      data.push({
        value: Math.max(0.000001, basePrice + random + trendEffect)
      });
    }
    console.log('Card chart data:', data); // Debug log
    return data;
  }, [token.price, token.change24h]);

  const isPositiveChange = token.change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group cursor-pointer ${
        isSelected ? 'ring-2 ring-solana-purple' : ''
      } ${token.isPinned ? 'border-2 border-solana-green/50' : ''}`}
      onClick={onClick}
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
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-solana-purple transition-colors">
                  {token.name}
                </h3>
                <p className="text-sm text-gray-400">{token.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  ${formatNumber(token.price)}
                </p>
                <div
                  className={`flex items-center space-x-1 ${
                    isPositiveChange ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  <span className="text-sm font-medium">
                    {isPositiveChange ? '↑' : '↓'} {formatPercentage(Math.abs(token.change24h))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[120px] w-full bg-gray-800/20 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData} 
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient id={`gradient-${token.address}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isPositiveChange ? '#22c55e' : '#ef4444'}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={isPositiveChange ? '#22c55e' : '#ef4444'}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositiveChange ? '#22c55e' : '#ef4444'}
                  strokeWidth={1.5}
                  fill={`url(#gradient-${token.address})`}
                  isAnimationActive={false}
                  dot={false}
                  activeDot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Market Cap</p>
                <p className="text-white font-medium">${formatNumber(token.marketCap)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Volume 24h</p>
                <p className="text-white font-medium">${formatNumber(token.volume24h)}</p>
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
                  <FaStar className={token.isFavorite ? 'text-yellow-400' : 'text-gray-600'} />
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
                  <FaRocket />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReaction(token.address, 'fire');
                  }}
                  className="text-sm bg-gray-800/50 px-2 py-1 rounded-md hover:bg-gray-700/50"
                >
                  <FaFire />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReaction(token.address, 'poop');
                  }}
                  className="text-sm bg-gray-800/50 px-2 py-1 rounded-md hover:bg-gray-700/50"
                >
                  <FaPoop />
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
  );
} 