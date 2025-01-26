'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useEffect, useMemo } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface PriceChartProps {
  data: number[]
  labels: string[]
  isLoading?: boolean
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      titleColor: '#9CA3AF',
      bodyColor: '#fff',
      borderColor: 'rgba(75, 85, 99, 0.3)',
      borderWidth: 1,
      padding: 12,
      bodyFont: {
        size: 12,
      },
      titleFont: {
        size: 12,
      },
      callbacks: {
        label: function(context: any) {
          return `$${context.parsed.y.toLocaleString()}`
        }
      }
    },
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: false,
      },
      ticks: {
        color: '#6B7280',
        font: {
          size: 10
        },
        maxRotation: 0
      }
    },
    y: {
      display: true,
      position: 'right' as const,
      grid: {
        color: 'rgba(75, 85, 99, 0.1)',
      },
      ticks: {
        color: '#6B7280',
        font: {
          size: 10
        },
        callback: function(value: any) {
          return '$' + value.toLocaleString()
        }
      }
    }
  }
}

export default function PriceChart({ data, labels, isLoading = false }: PriceChartProps) {
  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        data,
        borderColor: '#6157FF',
        backgroundColor: 'rgba(97, 87, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#6157FF',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      }
    ]
  }), [data, labels])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6157FF]" />
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <Line options={options} data={chartData} />
    </div>
  )
} 