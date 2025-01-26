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
  };
  isSelected: boolean;
  onClick: () => void;
}

export default function TokenCard({ token, isSelected, onClick }: TokenCardProps) {
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
        
        <div className="h-48 rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 p-6 relative overflow-hidden group-hover:border-blue-500/50 transition-all duration-300">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-50" />
          
          {/* Background Chart */}
          <div className="absolute inset-0 opacity-20">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={token.change24h >= 0 ? '#22c55e' : '#ef4444'}
                  fill={token.change24h >= 0 ? '#22c55e' : '#ef4444'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                  {token.name}
                </h3>
                <p className="text-sm text-gray-400">{token.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-white">
                  ${token.price.toLocaleString()}
                </p>
                <p
                  className={`text-sm ${
                    token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {token.change24h >= 0 ? '+' : ''}
                  {token.change24h.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Market Cap</p>
                  <p className="text-white">
                    ${(token.marketCap / 1e6).toFixed(2)}M
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Volume 24h</p>
                  <p className="text-white">
                    ${(token.volume24h / 1e6).toFixed(2)}M
                  </p>
                </div>
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