import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import TokenCard from './TokenCard';
import TokenDetailChart from './TokenDetailChart';
import { Token } from '@/types/token';

interface TokenGridProps {
  onTokenSelect: (token: Token | null) => void;
  selectedToken: Token | null;
  onTokenReaction: (token: Token, reaction: 'rocket' | 'fire' | 'poop') => void;
}

export default function TokenGrid({ onTokenSelect, selectedToken, onTokenReaction }: TokenGridProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'marketCap' | 'volume24h' | 'change24h'>('marketCap');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  // Calculate optimal columns based on container width
  const getGridColumns = (width: number) => {
    if (width < 640) return 1; // Mobile
    if (width < 900) return 2; // Small screens/tablets
    if (width < 1200) return 3; // Medium screens
    if (width < 1600) return 4; // Large screens
    return 5; // Extra large screens
  };

  useEffect(() => {
    // Initial container width measurement
    const updateWidth = () => {
      const gridContainer = document.getElementById('token-grid-container');
      if (gridContainer) {
        setContainerWidth(gridContainer.offsetWidth);
      }
    };

    // Update width on mount and window resize
    updateWidth();
    window.addEventListener('resize', updateWidth);

    // Cleanup
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

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

  const columns = getGridColumns(containerWidth);
  const cardWidth = Math.floor((containerWidth - (columns + 1) * 24) / columns); // 24px gap

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1E293B]/50 rounded-xl p-4 backdrop-blur-sm border border-[#334155]">
        <div className="flex flex-wrap gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-xl bg-[#1E293B] text-[#94A3B8] border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6157FF] focus:border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] hover:bg-[#252F43] transition-colors"
          >
            <option value="marketCap">Market Cap</option>
            <option value="price">Price</option>
            <option value="volume24h">Volume</option>
            <option value="change24h">Change</option>
          </select>
          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
              filterFavorites
                ? 'bg-[#6157FF] text-white border-[#6157FF] shadow-[0_0_12px_rgba(97,87,255,0.2)]'
                : 'bg-[#1E293B] text-[#94A3B8] border-[#334155] hover:bg-[#252F43]'
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Grid */}
      <div 
        id="token-grid-container"
        className="grid gap-6 auto-rows-[280px]"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {/* Add Token Card */}
        <div
          onClick={() => window.dispatchEvent(new CustomEvent('openAddTokenModal'))}
          className="rounded-xl bg-[#1E293B] border border-[#334155] p-6 flex items-center justify-center cursor-pointer group transition-all duration-300
            hover:bg-[#252F43] hover:border-[#6157FF]/30 hover:shadow-[0_0_20px_rgba(97,87,255,0.1)]
            shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.01)]"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#252F43] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
              <svg className="w-8 h-8 text-[#6157FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#6157FF] transition-colors">
              Add Token
            </h3>
            <p className="text-[#94A3B8] mt-2 text-sm">Track a new token</p>
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