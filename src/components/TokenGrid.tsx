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

export default function TokenGrid() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'marketCap' | 'volume24h' | 'change24h'>('marketCap');
  const [filterFavorites, setFilterFavorites] = useState(false);

  useEffect(() => {
    const handleTokenAdded = (event: CustomEvent<Token>) => {
      setTokens(prevTokens => [...prevTokens, {
        ...event.detail,
        votes: 0,
        reactions: { rocket: 0, fire: 0, poop: 0 },
        isFavorite: false,
        isPinned: false
      }]);
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/10 via-purple-500/10 to-solana-green/10 animate-gradient-xy" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0),rgba(17,24,39,1))]" />
      </div>

      {/* Controls */}
      <div className="relative z-10 p-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-solana-purple"
          >
            <option value="marketCap">Market Cap</option>
            <option value="price">Price</option>
            <option value="volume24h">Volume</option>
            <option value="change24h">Change</option>
          </select>
          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              filterFavorites
                ? 'bg-solana-purple text-white border-solana-purple'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="relative z-10 p-6 pt-0">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {/* Add Token Card */}
          <motion.div variants={item}>
            <div
              onClick={() => window.dispatchEvent(new CustomEvent('openAddTokenModal'))}
              className="h-[280px] rounded-xl glass border border-gray-700/50 p-6 flex items-center justify-center relative overflow-hidden cursor-pointer group hover:border-solana-purple/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-solana-purple/10 to-solana-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
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
          </motion.div>

          {/* Token Cards */}
          <AnimatePresence>
            {filteredTokens.map((token) => (
              <motion.div
                key={token.address}
                variants={item}
                layout
              >
                <TokenCard
                  token={token}
                  isSelected={selectedToken?.address === token.address}
                  onClick={() => setSelectedToken(token)}
                  onPin={handlePin}
                  onVote={handleVote}
                  onReaction={handleReaction}
                  onFavorite={handleFavorite}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Selected Token Chart */}
      <AnimatePresence>
        {selectedToken && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-20 p-6 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50"
          >
            <TokenDetailChart
              token={selectedToken}
              onClose={() => setSelectedToken(null)}
              onReaction={(reaction) => handleReaction(selectedToken.address, reaction)}
              onFavorite={() => handleFavorite(selectedToken.address)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 