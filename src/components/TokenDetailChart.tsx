import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { FaRocket, FaFire, FaPoop, FaStar, FaTimes } from 'react-icons/fa';
import { formatNumber, formatPrice, formatPercentage } from '@/utils/format';

interface Token {
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
}

interface TokenDetailChartProps {
  token: Token;
  onClose: () => void;
  onReaction?: (reaction: 'rocket' | 'fire' | 'poop') => void;
  onFavorite?: () => void;
}

export default function TokenDetailChart({ token, onClose, onReaction, onFavorite }: TokenDetailChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [isLoading, setIsLoading] = useState(true);
  const isPositiveChange = token.change24h >= 0;

  useEffect(() => {
    setIsLoading(true);
    // Generate mock chart data for demonstration
    const generateMockData = () => {
      const data = [];
      const periods = selectedTimeframe === '24h' ? 24 : selectedTimeframe === '7d' ? 7 : 30;
      const basePrice = token.price;
      const volatility = basePrice * 0.1; // 10% volatility
      const trend = isPositiveChange ? 0.6 : -0.6; // Bias the trend based on 24h change

      let currentPrice = basePrice;
      for (let i = 0; i < periods; i++) {
        const time = selectedTimeframe === '24h' 
          ? `${i}:00`
          : selectedTimeframe === '7d'
          ? `Day ${i + 1}`
          : `Week ${Math.floor(i / 7) + 1}`;
        
        // Add some randomness but maintain the trend
        const random = (Math.random() - 0.5) * volatility;
        const trendEffect = (trend * volatility * i) / periods;
        currentPrice = basePrice + random + trendEffect;
        
        data.push({
          time,
          price: Math.max(0, currentPrice) // Ensure price doesn't go negative
        });
      }
      return data;
    };

    // Simulate API delay
    const timer = setTimeout(() => {
      setChartData(generateMockData());
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedTimeframe, token.price, isPositiveChange]);

  const timeframes = [
    { label: '24h', value: '24h' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-gray-900 rounded-xl border border-gray-700/50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">{token.name}</h2>
            <p className="text-gray-400">{token.symbol}</p>
          </div>
          <div className="flex items-center space-x-4">
            {onFavorite && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onFavorite}
                className="text-xl"
              >
                <FaStar className={token.isFavorite ? 'text-yellow-400' : 'text-gray-600'} />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-baseline">
            <p className="text-3xl font-bold text-white">{formatPrice(token.price)}</p>
            <div
              className={`flex items-center space-x-2 ${
                isPositiveChange ? 'text-green-400' : 'text-red-400'
              }`}
            >
              <span className="text-lg font-medium">
                {isPositiveChange ? '↑' : '↓'} {formatPercentage(Math.abs(token.change24h))}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400">Market Cap</p>
              <p className="text-lg font-medium text-white">${formatNumber(token.marketCap)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Volume 24h</p>
              <p className="text-lg font-medium text-white">${formatNumber(token.volume24h)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setSelectedTimeframe(tf.value as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === tf.value
                    ? 'bg-solana-purple text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[300px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-solana-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
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
                <XAxis
                  dataKey="time"
                  stroke="#4b5563"
                  tick={{ fill: '#9ca3af' }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#4b5563"
                  tick={{ fill: '#9ca3af' }}
                  tickLine={false}
                  tickFormatter={(value) => `$${formatNumber(value)}`}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#9ca3af' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`$${formatNumber(value)}`, 'Price']}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositiveChange ? '#22c55e' : '#ef4444'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Reactions */}
      {onReaction && (
        <div className="p-6 border-t border-gray-700/50">
          <div className="flex justify-around">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onReaction('rocket')}
              className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <FaRocket className="text-xl" />
              <span>{token.reactions?.rocket || 0}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onReaction('fire')}
              className="flex items-center space-x-2 text-gray-400 hover:text-orange-400 transition-colors"
            >
              <FaFire className="text-xl" />
              <span>{token.reactions?.fire || 0}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onReaction('poop')}
              className="flex items-center space-x-2 text-gray-400 hover:text-brown-400 transition-colors"
            >
              <FaPoop className="text-xl" />
              <span>{token.reactions?.poop || 0}</span>
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
} 