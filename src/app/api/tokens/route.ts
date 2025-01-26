import { NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

interface TokenMetadata {
  name: string;
  symbol: string;
  logoUrl: string;
}

// Known tokens metadata
const KNOWN_TOKENS: Record<string, TokenMetadata> = {
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
    name: 'USD Coin',
    symbol: 'USDC',
    logoUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  },
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': {
    name: 'Bonk',
    symbol: 'BONK',
    logoUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png'
  },
  'So11111111111111111111111111111111111111112': {
    name: 'Wrapped SOL',
    symbol: 'SOL',
    logoUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
  }
};

export async function POST(request: Request) {
  try {
    const { address, description = '' } = await request.json();
    
    if (!address) {
      return NextResponse.json({ error: 'Token address is required' }, { status: 400 });
    }

    const normalizedAddress = address.trim();
    
    // Fetch token data from CoinGecko
    const response = await fetch(
      `${COINGECKO_API}/simple/token_price/solana?contract_addresses=${normalizedAddress}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch token data');
    }

    const data = await response.json();
    const tokenData = data[normalizedAddress.toLowerCase()];

    if (!tokenData) {
      // For testing, return mock data if token not found
      return NextResponse.json({
        id: normalizedAddress,
        address: normalizedAddress,
        name: KNOWN_TOKENS[normalizedAddress]?.name || `Token ${normalizedAddress.slice(0, 6)}...`,
        symbol: KNOWN_TOKENS[normalizedAddress]?.symbol || 'TOKEN',
        image: KNOWN_TOKENS[normalizedAddress]?.logoUrl || '',
        description,
        price: 1.0,
        change24h: 0,
        volume24h: 1000000,
        marketCap: 1000000000,
        chartData: {
          timestamps: Array.from({ length: 24 }, (_, i) => Date.now() - (23 - i) * 3600000),
          prices: Array.from({ length: 24 }, () => 1.0 * (0.995 + Math.random() * 0.01))
        }
      });
    }

    // Create token object with real data
    const token = {
      id: normalizedAddress,
      address: normalizedAddress,
      name: KNOWN_TOKENS[normalizedAddress]?.name || `Token ${normalizedAddress.slice(0, 6)}...`,
      symbol: KNOWN_TOKENS[normalizedAddress]?.symbol || 'TOKEN',
      image: KNOWN_TOKENS[normalizedAddress]?.logoUrl || '',
      description,
      price: tokenData.usd,
      change24h: tokenData.usd_24h_change,
      volume24h: tokenData.usd_24h_vol,
      marketCap: tokenData.usd_market_cap,
      chartData: {
        timestamps: Array.from({ length: 24 }, (_, i) => Date.now() - (23 - i) * 3600000),
        prices: Array.from({ length: 24 }, () => tokenData.usd * (0.995 + Math.random() * 0.01))
      }
    };

    return NextResponse.json(token);
  } catch (error: any) {
    console.error('Error validating token:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to validate token' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const addresses = searchParams.get('addresses')?.split(',') || [];

    if (addresses.length === 0) {
      return NextResponse.json({ prices: [] });
    }

    // Generate mock price data for testing
    const prices = addresses.map(address => {
      const basePrice = address.toLowerCase() === 'epjfwdd5aufqssqem2qn1xzybapc8g4weggkzwytdt1v' 
        ? 1.00 // USDC price
        : Math.random() * 100;

      return {
        address: address.toLowerCase(),
        price: basePrice,
        volume24h: Math.random() * 1000000,
        marketCap: basePrice * 1000000,
        change24h: (Math.random() * 20) - 10,
      };
    });

    return NextResponse.json({ prices });
  } catch (error) {
    console.error('Price generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate prices' },
      { status: 500 }
    );
  }
} 