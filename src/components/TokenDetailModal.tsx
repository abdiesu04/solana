import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
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
    votes: number;
  };
}

export default function TokenDetailModal({ isOpen, onClose, token }: TokenDetailModalProps) {
  // Generate mock price data for the chart
  const priceData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: token.price * (0.95 + Math.random() * 0.1),
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-gray-900/95 border border-gray-700/50 backdrop-blur-xl p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Dialog.Title className="text-2xl font-semibold text-white">
                      {token.name} ({token.symbol})
                    </Dialog.Title>
                    <p className="text-sm text-gray-400 mt-1">
                      {token.address}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Price and Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Price</p>
                    <p className="text-2xl font-semibold text-white">
                      ${token.price.toLocaleString()}
                    </p>
                    <p className={`text-sm ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Market Cap</p>
                    <p className="text-2xl font-semibold text-white">
                      ${(token.marketCap / 1e6).toFixed(2)}M
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">24h Volume</p>
                    <p className="text-2xl font-semibold text-white">
                      ${(token.volume24h / 1e6).toFixed(2)}M
                    </p>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-gray-800/30 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-medium text-white mb-4">Price Chart (24h)</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={priceData}>
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
                            backgroundColor: '#111827',
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
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <h3 className="text-lg font-medium text-white mb-4">Community Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Votes</span>
                        <span className="text-white font-medium">{token.votes}</span>
                      </div>
                      {/* Add more stats as needed */}
                    </div>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <h3 className="text-lg font-medium text-white mb-4">Token Info</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Contract</span>
                        <span className="text-white font-medium truncate ml-4 max-w-[200px]">
                          {token.address}
                        </span>
                      </div>
                      {/* Add more token info as needed */}
                    </div>
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