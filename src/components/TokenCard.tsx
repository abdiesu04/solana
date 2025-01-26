import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

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
}

export default function TokenCard({ token }: TokenCardProps) {
  const dummyData = Array.from({ length: 20 }, (_, i) => ({
    value: Math.random() * 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="h-48 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-6 relative overflow-hidden group"
    >
      {/* Background Chart */}
      <div className="absolute inset-0 opacity-20">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dummyData}>
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
            <h3 className="text-lg font-semibold text-white">{token.name}</h3>
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
    </motion.div>
  );
} 