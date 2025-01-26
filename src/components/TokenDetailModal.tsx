import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface TokenDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function TokenDetailModal({ isOpen, onClose, token }: TokenDetailModalProps) {
  // Generate mock data for the chart
  const data = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: token.price * (1 + Math.sin(i / 3) * 0.05),
  }));

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-gray-900 rounded-xl border border-gray-700 p-6 w-full max-w-3xl transform transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Dialog.Title className="text-2xl font-bold text-white">
                      {token.name} ({token.symbol})
                    </Dialog.Title>
                    <p className="text-gray-400 text-sm mt-1">{token.address}</p>
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

                {/* Price Chart */}
                <div className="h-64 mb-6">
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

                {/* Token Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Price</p>
                    <p className="text-white text-lg font-semibold">
                      ${token.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">24h Change</p>
                    <p
                      className={`text-lg font-semibold ${
                        token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {token.change24h.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">24h Volume</p>
                    <p className="text-white text-lg font-semibold">
                      ${(token.volume24h / 1e6).toFixed(2)}M
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Market Cap</p>
                    <p className="text-white text-lg font-semibold">
                      ${(token.marketCap / 1e6).toFixed(2)}M
                    </p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 