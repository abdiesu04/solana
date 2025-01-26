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
    const generateMockData = () => {
      const data = [];
      const periods = selectedTimeframe === '24h' ? 24 : selectedTimeframe === '7d' ? 7 : 30;
      const basePrice = token.price;
      const volatility = basePrice * 0.1;
      const trend = isPositiveChange ? 0.6 : -0.6;

      for (let i = 0; i < periods; i++) {
        const time = selectedTimeframe === '24h' 
          ? `${i}:00`
          : selectedTimeframe === '7d'
          ? `Day ${i + 1}`
          : `Week ${Math.floor(i / 7) + 1}`;
        
        const random = (Math.random() - 0.5) * volatility;
        const trendEffect = (trend * volatility * i) / periods;
        const price = Math.max(0.000001, basePrice + random + trendEffect);
        
        data.push({
          time,
          price
        });
      }
      return data;
    };

    // Generate data immediately
    const data = generateMockData();
    console.log('Generated chart data:', data);
    setChartData(data);
    setIsLoading(false);
  }, [selectedTimeframe, token.price, isPositiveChange]);

  const timeframes = [
    { label: '24h', value: '24h' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[1000]" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[1001] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl bg-gray-900 rounded-xl shadow-2xl border border-gray-800"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700/50 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{token.name}</h2>
                  <p className="text-gray-400">{token.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">${formatPrice(token.price)}</p>
                  <p className={`text-lg ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositiveChange ? '↑' : '↓'} {formatPercentage(Math.abs(token.change24h))}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 p-6 bg-gray-800/20">
              <div>
                <p className="text-sm text-gray-400">Market Cap</p>
                <p className="text-lg font-semibold text-white">${formatNumber(token.marketCap)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Volume 24h</p>
                <p className="text-lg font-semibold text-white">${formatNumber(token.volume24h)}</p>
              </div>
            </div>

            {/* Chart section */}
            <div className="p-6">
              <div className="flex gap-2 mb-6">
                {timeframes.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setSelectedTimeframe(tf.value as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTimeframe === tf.value
                        ? 'bg-solana-purple text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              <div className="h-[400px] w-full bg-gray-800/20 rounded-lg p-4">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-solana-purple border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={chartData}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isPositiveChange ? '#22c55e' : '#ef4444'} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={isPositiveChange ? '#22c55e' : '#ef4444'} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="time"
                        stroke="#6b7280"
                        tick={{ fill: '#9ca3af' }}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#6b7280"
                        tick={{ fill: '#9ca3af' }}
                        tickLine={false}
                        tickFormatter={(value) => `$${formatNumber(value)}`}
                        width={80}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          padding: '8px'
                        }}
                        labelStyle={{ color: '#9ca3af' }}
                        formatter={(value: number) => [`$${formatNumber(value)}`, 'Price']}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={isPositiveChange ? '#22c55e' : '#ef4444'}
                        strokeWidth={2}
                        fill="url(#colorPrice)"
                        isAnimationActive={true}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Reactions */}
            {onReaction && (
              <div className="p-6 border-t border-gray-800 bg-gray-800/20">
                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onReaction('rocket')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    <FaRocket className="text-yellow-500" />
                    <span className="text-white">{token.reactions?.rocket || 0}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onReaction('fire')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    <FaFire className="text-orange-500" />
                    <span className="text-white">{token.reactions?.fire || 0}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onReaction('poop')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    <FaPoop className="text-brown-500" />
                    <span className="text-white">{token.reactions?.poop || 0}</span>
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
} 