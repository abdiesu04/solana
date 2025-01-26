'use client'

import React, { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { coingeckoService } from '@/services/coingecko';
import { ChartData } from '@/services/coingecko';
import { Token } from '@/types/token';
import PriceChart from './PriceChart';

interface TokenDetailChartProps {
  token: Token;
  onClose?: () => void;
  onReaction?: (type: string) => void;
}

interface TimeframeOption {
  label: string;
  value: '24h' | '7d' | '30d';
  days: number;
}

const timeframes: TimeframeOption[] = [
  { label: '24H', value: '24h', days: 1 },
  { label: '7D', value: '7d', days: 7 },
  { label: '30D', value: '30d', days: 30 }
];

export default function TokenDetailChart({ token, onClose, onReaction }: TokenDetailChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>(timeframes[1]);
  const [chartData, setChartData] = useState<{ date: Date; price: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const data = await coingeckoService.getChartData(token.address, selectedTimeframe.value);
        
        if (!data?.prices?.length) {
          throw new Error('No chart data available');
        }

        // Transform the data for the chart
        const formattedData = data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp),
          price: price
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        // Set empty data instead of leaving stale data
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    if (token.address) {
      fetchChartData();
    }
  }, [token.address, selectedTimeframe.value]);

  if (loading) {
    return (
      <div className="w-full h-[400px] bg-gray-900 rounded-lg animate-pulse" />
    );
  }

  if (!chartData.length) {
    return (
      <div className="w-full h-[400px] bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No chart data available</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={token.image}
            alt={token.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold text-white">
              {token.name}
              <span className="ml-2 text-[#94A3B8] font-medium">
                {token.symbol}
              </span>
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl font-bold text-white">
                ${token.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                })}
              </span>
              <span className={`text-sm font-medium ${
                token.change24h >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'
              }`}>
                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[#252F43] transition-colors"
        >
          <svg className="w-5 h-5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Timeframe selector */}
      <div className="flex gap-2 mb-4">
        {timeframes.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setSelectedTimeframe(tf)}
            className={`px-3 py-1 rounded ${
              selectedTimeframe.value === tf.value ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                if (selectedTimeframe.value === '24h') {
                  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
                return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' });
              }}
              stroke="#6b7280"
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              stroke="#6b7280"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.[0]?.value) {
                  return (
                    <div className="bg-gray-800 border border-gray-700 p-2 rounded shadow">
                      <p className="text-gray-300">
                        {new Date(payload[0].payload.date).toLocaleString()}
                      </p>
                      <p className="text-blue-400 font-semibold">
                        ${Number(payload[0].value).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6
                        })}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorPrice)"
              isAnimationActive={true}
              animationDuration={750}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-[#252F43] rounded-xl p-4">
          <p className="text-sm text-[#94A3B8] font-medium">Market Cap</p>
          <p className="text-lg text-white font-bold mt-1">
            ${(token.marketCap / 1e9).toFixed(2)}B
          </p>
        </div>
        <div className="bg-[#252F43] rounded-xl p-4">
          <p className="text-sm text-[#94A3B8] font-medium">Volume 24h</p>
          <p className="text-lg text-white font-bold mt-1">
            ${(token.volume24h / 1e9).toFixed(2)}B
          </p>
        </div>
      </div>

      {/* Reactions */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-2">
          {['rocket', 'fire'].map((reaction) => (
            <button
              key={reaction}
              onClick={() => onReaction?.(reaction as string)}
              className="group flex items-center space-x-1 px-3 py-2 rounded-lg bg-[#252F43] hover:bg-[#2C374B] transition-colors"
            >
              <span className="text-base">
                {reaction === 'rocket' ? '🚀' : '🔥'}
              </span>
              <span className="text-sm text-[#94A3B8] group-hover:text-white transition-colors">
                {token.reactions?.[reaction as keyof typeof token.reactions] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 