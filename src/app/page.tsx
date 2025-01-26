'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import TokenCard from '@/components/TokenCard';
import TrendingTokens from '@/components/TrendingTokens';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock trending token data
const mockTrendingTokens = [
  {
    address: 'So11111111111111111111111111111111111111112',
    name: 'Wrapped SOL',
    symbol: 'wSOL',
    price: 101.25,
    marketCap: 40000000000,
    volume24h: 1200000000,
    change24h: 5.67,
    votes: 1234
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    name: 'USD Coin',
    symbol: 'USDC',
    price: 1.00,
    marketCap: 25000000000,
    volume24h: 800000000,
    change24h: 0.01,
    votes: 987
  },
  {
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    name: 'BONK',
    symbol: 'BONK',
    price: 0.000012,
    marketCap: 700000000,
    volume24h: 150000000,
    change24h: 12.34,
    votes: 2345
  },
  {
    address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    name: 'Raydium',
    symbol: 'RAY',
    price: 2.45,
    marketCap: 350000000,
    volume24h: 50000000,
    change24h: -3.21,
    votes: 876
  }
];

// Mock token data for the grid
const mockTokens = [
  {
    address: 'So11111111111111111111111111111111111111112',
    name: 'Wrapped SOL',
    symbol: 'wSOL',
    price: 101.25,
    marketCap: 40000000000,
    volume24h: 1200000000,
    change24h: 5.67,
    votes: 1234,
    isPinned: false,
    reactions: {
      rocket: 42,
      fire: 23
    },
    isFavorite: false
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    name: 'USD Coin',
    symbol: 'USDC',
    price: 1.00,
    marketCap: 25000000000,
    volume24h: 800000000,
    change24h: 0.01,
    votes: 987,
    isPinned: false,
    reactions: {
      rocket: 15,
      fire: 8
    },
    isFavorite: false
  }
];

export default function Home() {
  const [tokens, setTokens] = useState(mockTokens);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  // Mock user data
  const mockUser = {
    address: '0x1234...5678',
    username: 'Demo User',
    isAuthenticated: false
  };

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  const handleLogin = () => {
    console.log('Logging in...');
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleNavigate = (route: string) => {
    console.log('Navigating to:', route);
  };

  const handleViewAllTrending = () => {
    console.log('Viewing all trending tokens...');
  };

  const handleTokenPin = (address: string) => {
    setTokens(prevTokens => 
      prevTokens.map(token => 
        token.address === address 
          ? { ...token, isPinned: !token.isPinned }
          : token
      )
    );
  };

  const handleTokenVote = (address: string) => {
    setTokens(prevTokens => 
      prevTokens.map(token => 
        token.address === address 
          ? { ...token, votes: token.votes + 1 }
          : token
      )
    );
  };

  const handleTokenReaction = (address: string, reaction: 'rocket' | 'fire') => {
    setTokens(prevTokens => 
      prevTokens.map(token => 
        token.address === address 
          ? {
              ...token,
              reactions: {
                ...token.reactions,
                [reaction]: (token.reactions?.[reaction] || 0) + 1
              }
            }
          : token
      )
    );
  };

  const handleTokenFavorite = (address: string) => {
    setTokens(prevTokens => 
      prevTokens.map(token => 
        token.address === address 
          ? { ...token, isFavorite: !token.isFavorite }
          : token
      )
    );
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Navbar */}
        <Navbar
          user={mockUser}
          onSearch={handleSearch}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
        
        {/* Main Content */}
        <main className="pt-20"> {/* Increased padding-top to account for navbar height */}
          {/* Trending Tokens Section */}
          <section className="w-full bg-gradient-to-r from-purple-500/10 to-green-500/10 dark:from-purple-900/20 dark:to-green-900/20">
            <div className="max-w-7xl mx-auto">
              <TrendingTokens 
                tokens={mockTrendingTokens}
                onViewAll={handleViewAllTrending}
              />
            </div>
          </section>

          {/* Token Grid Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tokens.map(token => (
                <TokenCard
                  key={token.address}
                  token={token}
                  isSelected={selectedToken === token.address}
                  onClick={() => setSelectedToken(token.address)}
                  onPin={handleTokenPin}
                  onVote={handleTokenVote}
                  onReaction={handleTokenReaction}
                  onFavorite={handleTokenFavorite}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
} 