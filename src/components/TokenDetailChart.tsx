import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';

interface TokenDetailChartProps {
  token: {
    name: string;
    symbol: string;
    price: number;
    marketCap: number;
    volume24h: number;
    change24h: number;
  };
  onClose: () => void;
}

export default function TokenDetailChart({ token, onClose }: TokenDetailChartProps) {
  // Generate mock data for the chart
  const data = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: token.price * (1 + Math.sin(i / 3) * 0.05),
  }));

  return (
    <motion.div
      className="bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 h-full"
      layout
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {token.name} ({token.symbol})
          </h2>
          <p className="text-gray-400 text-sm mt-1">24h Price Chart</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Chart */}
      <div className="h-[400px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={token.change24h >= 0 ? '#22c55e' : '#ef4444'}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={token.change24h >= 0 ? '#22c55e' : '#ef4444'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={token.change24h >= 0 ? '#22c55e' : '#ef4444'}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Price</p>
          <p className="text-white text-lg font-semibold">
            ${token.price.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-gray-400 text-sm">24h Change</p>
          <p
            className={`text-lg font-semibold ${
              token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {token.change24h.toFixed(2)}%
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-gray-400 text-sm">24h Volume</p>
          <p className="text-white text-lg font-semibold">
            ${(token.volume24h / 1e6).toFixed(2)}M
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Market Cap</p>
          <p className="text-white text-lg font-semibold">
            ${(token.marketCap / 1e6).toFixed(2)}M
          </p>
        </div>
      </div>
    </motion.div>
  );
} 