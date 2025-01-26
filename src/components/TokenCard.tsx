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
import { Token } from '@/types/token';

interface TokenCardProps {
  token: Token;
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
  onFavorite,
}: TokenCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatCompactNumber = (num: number) => {
    const trillion = 1e12;
    const billion = 1e9;
    const million = 1e6;
    const thousand = 1e3;

    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (num >= trillion) {
      return `${formatter.format(num / trillion)}T`;
    }
    if (num >= billion) {
      return `${formatter.format(num / billion)}B`;
    }
    if (num >= million) {
      return `${formatter.format(num / million)}M`;
    }
    if (num >= thousand) {
      return `${formatter.format(num / thousand)}K`;
    }
    
    // For numbers less than 1000
    if (num >= 1) {
      return formatter.format(num);
    }
    // For very small numbers (less than 1)
    return num.toFixed(6);
  };

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
      layout
      onClick={onClick}
      className={`relative rounded-lg overflow-hidden p-2 sm:p-3 cursor-pointer transition-all duration-300 group h-[80px] sm:h-[220px] md:h-[280px]
        ${isSelected 
          ? 'bg-[#252F43] border-[#6157FF] shadow-[0_0_20px_rgba(97,87,255,0.1)]' 
          : 'bg-[#1E293B] border-[#334155] hover:bg-[#252F43] hover:border-[#6157FF]/30'
        } border shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.01)]`}
    >
      <div className="flex flex-col h-full">
        {/* Mobile view (minimal) */}
        <div className="sm:hidden flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-bold text-white">
              {token.symbol.slice(0, 3)}
            </span>
            <span className={`text-xs font-medium ${
              token.change24h >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'
            }`}>
              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
            </span>
          </div>
          <span className="text-sm font-bold text-white">
            ${formatCompactNumber(token.price)}
          </span>
        </div>

        {/* Tablet/Desktop view (full) */}
        <div className="hidden sm:flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0 mr-2">
              <h3 className="text-base md:text-lg font-bold text-white truncate">
                {token.name}
                <span className="text-sm font-medium text-[#94A3B8] ml-1">
                  {token.symbol}
                </span>
              </h3>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite(token.address);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  token.isFavorite
                    ? 'text-[#F59E0B] bg-[#F59E0B]/10'
                    : 'text-[#94A3B8] hover:text-[#F59E0B] hover:bg-[#F59E0B]/10'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPin(token.address);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  token.isPinned
                    ? 'text-[#6157FF] bg-[#6157FF]/10'
                    : 'text-[#94A3B8] hover:text-[#6157FF] hover:bg-[#6157FF]/10'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.828.722a.5.5 0 01.354 0l7.071 3.536a.5.5 0 01.01.868L9.5 9.972 1.737 5.126a.5.5 0 01.01-.868L8.818.722a.5.5 0 011.01 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Price and change */}
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-lg md:text-xl font-bold text-white">
              ${formatCompactNumber(token.price)}
            </span>
            <span className={`text-sm font-medium ${
              token.change24h >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'
            }`}>
              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
            </span>
          </div>

          {/* Stats */}
          <div className="mt-auto">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-[#94A3B8] font-medium">Market Cap</p>
                <p className="text-sm text-white font-semibold">${formatCompactNumber(token.marketCap)}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8] font-medium">Volume 24h</p>
                <p className="text-sm text-white font-semibold">${formatCompactNumber(token.volume24h)}</p>
              </div>
            </div>

            {/* Reactions */}
            <div className="md:flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                {['rocket', 'fire'].map((reaction) => (
                  <button
                    key={reaction}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReaction(token.address, reaction as 'rocket' | 'fire' | 'poop');
                    }}
                    className="group flex items-center space-x-1 px-2 py-1 rounded-lg bg-[#252F43]/50 hover:bg-[#252F43] transition-colors"
                  >
                    <span className="text-sm">
                      {reaction === 'rocket' ? '🚀' : '🔥'}
                    </span>
                    <span className="text-xs text-[#94A3B8] group-hover:text-white transition-colors">
                      {token.reactions?.[reaction as keyof typeof token.reactions] || 0}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-[#94A3B8]">{token.votes || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 