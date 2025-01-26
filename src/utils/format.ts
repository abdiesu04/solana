export function formatNumber(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  if (value < 0.01) {
    return value.toFixed(6);
  }
  return value.toFixed(2);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatPrice(value: number): string {
  if (value < 0.01) {
    return `$${value.toFixed(6)}`;
  }
  return `$${value.toFixed(2)}`;
} 