import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import TokenCard from './TokenCard';
import TokenDetailChart from './TokenDetailChart';

interface Token {
  address: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  votes: number;
  isPinned?: boolean;
  reactions?: {
    rocket: number;
    fire: number;
    poop: number;
  };
  isFavorite?: boolean;
}

interface TokenGridProps {
  onTokenSelect: (token: Token | null) => void;
  selectedToken: Token | null;
  onTokenReaction: (token: Token, reaction: 'rocket' | 'fire' | 'poop') => void;
}

export default function TokenGrid({ onTokenSelect, selectedToken, onTokenReaction }: TokenGridProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'marketCap' | 'volume24h' | 'change24h'>('marketCap');
  const [filterFavorites, setFilterFavorites] = useState(false);

  useEffect(() => {
    // Mock data for demonstration
    const mockTokens: Token[] = [
      {
        address: '0x123',
        name: 'Solana',
        symbol: 'SOL',
        price: 123.45,
        marketCap: 1234567890,
        volume24h: 987654321,
        change24h: 5.67,
        votes: 100,
        reactions: {
          rocket: 10,
          fire: 5,
          poop: 2
        }
      },
      {
        address: '0x456',
        name: 'Ethereum',
        symbol: 'ETH',
        price: 2345.67,
        marketCap: 9876543210,
        volume24h: 876543210,
        change24h: -2.34,
        votes: 80,
        reactions: {
          rocket: 8,
          fire: 12,
          poop: 1
        }
      },
      // Add more mock tokens as needed
    ];

    setTokens(mockTokens);

    // Listen for new tokens
    const handleTokenAdded = (event: CustomEvent<Token>) => {
      setTokens(prev => [...prev, event.detail]);
    };

    window.addEventListener('tokenAdded', handleTokenAdded as EventListener);
    return () => window.removeEventListener('tokenAdded', handleTokenAdded as EventListener);
  }, []);

  const handlePin = (address: string) => {
    setTokens(tokens.map(token => 
      token.address === address 
        ? { ...token, isPinned: !token.isPinned }
        : token
    ));
  };

  const handleVote = (address: string) => {
    setTokens(tokens.map(token =>
      token.address === address
        ? { ...token, votes: (token.votes || 0) + 1 }
        : token
    ));
  };

  const handleReaction = (address: string, reaction: 'rocket' | 'fire' | 'poop') => {
    setTokens(tokens.map(token => {
      if (token.address === address) {
        return {
          ...token,
          reactions: {
            ...token.reactions,
            [reaction]: (token.reactions?.[reaction] || 0) + 1
          }
        };
      }
      return token;
    }));
  };

  const handleFavorite = (address: string) => {
    setTokens(tokens.map(token =>
      token.address === address
        ? { ...token, isFavorite: !token.isFavorite }
        : token
    ));
  };

  const sortedTokens = [...tokens].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b[sortBy] - a[sortBy];
  });

  const filteredTokens = filterFavorites 
    ? sortedTokens.filter(token => token.isFavorite)
    : sortedTokens;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4">
        <div className="flex gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-solana-purple"
          >
            <option value="marketCap">Market Cap</option>
            <option value="price">Price</option>
            <option value="volume24h">Volume</option>
            <option value="change24h">Change</option>
          </select>
          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filterFavorites
                ? 'bg-solana-purple text-white border-solana-purple'
                : 'bg-gray-700/50 text-gray-300 border-gray-600 hover:text-white'
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Add Token Card */}
        <div
          onClick={() => window.dispatchEvent(new CustomEvent('openAddTokenModal'))}
          className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 flex items-center justify-center cursor-pointer hover:bg-gray-700/50 hover:border-solana-purple/50 transition-all group h-[260px]"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-solana-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-solana-purple transition-colors">
              Add Token
            </h3>
            <p className="text-gray-400 mt-2">Track a new token</p>
          </div>
        </div>

        {/* Token Cards */}
        {filteredTokens.map((token) => (
          <TokenCard
            key={token.address}
            token={token}
            isSelected={selectedToken?.address === token.address}
            onClick={() => onTokenSelect(token)}
            onPin={(address) => {
              setTokens(prev =>
                prev.map(t =>
                  t.address === address ? { ...t, isPinned: !t.isPinned } : t
                )
              );
            }}
            onVote={(address) => {
              setTokens(prev =>
                prev.map(t =>
                  t.address === address ? { ...t, votes: (t.votes || 0) + 1 } : t
                )
              );
            }}
            onReaction={(address, reaction) => {
              const token = tokens.find(t => t.address === address);
              if (token) {
                onTokenReaction(token, reaction);
              }
            }}
            onFavorite={(address) => {
              setTokens(prev =>
                prev.map(t =>
                  t.address === address ? { ...t, isFavorite: !t.isFavorite } : t
                )
              );
            }}
          />
        ))}
      </div>
    </div>
  );
} 