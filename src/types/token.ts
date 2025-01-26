export interface Token {
  id: string;
  address: string;
  name: string;
  symbol: string;
  image: string;
  description?: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  reactions?: {
    rocket?: number;
    fire?: number;
    poop?: number;
  };
  isPinned?: boolean;
  isFavorite?: boolean;
  votes?: number;
  chartData?: {
    timestamps: number[];
    prices: number[];
  };
} 