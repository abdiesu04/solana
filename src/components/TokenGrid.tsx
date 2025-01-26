import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import AddTokenModal from './AddTokenModal';
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
  reactions?: {
    rocket: number;
    fire: number;
    poop: number;
  };
  isFavorite?: boolean;
}

export default function TokenGrid() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const handleReaction = (tokenAddress: string, reaction: 'rocket' | 'fire' | 'poop') => {
    setTokens(tokens.map(token => {
      if (token.address === tokenAddress) {
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

  const toggleFavorite = (tokenAddress: string) => {
    setTokens(tokens.map(token => {
      if (token.address === tokenAddress) {
        return {
          ...token,
          isFavorite: !token.isFavorite
        };
      }
      return token;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0),rgba(17,24,39,1))]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 flex gap-6">
        {/* Left side - Chart Area */}
        <AnimatePresence>
          {selectedToken && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="hidden lg:block w-1/2 sticky top-6 h-[calc(100vh-3rem)]"
            >
              <TokenDetailChart 
                token={selectedToken}
                onClose={() => setSelectedToken(null)}
                onReaction={handleReaction}
                onFavorite={toggleFavorite}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right side - Token Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${selectedToken ? 'lg:w-1/2' : 'w-full'}`}>
          {/* Add Token Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer relative group"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="h-48 rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 p-6 flex items-center justify-center relative overflow-hidden group-hover:border-blue-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex flex-col items-center space-y-4 relative z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors duration-300">
                  Add Token
                </span>
                <span className="text-sm text-gray-400 text-center">
                  Click to add a new token
                </span>
              </div>
              {/* Animated border effect */}
              <div className="absolute inset-0 border border-blue-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 animate-pulse-slow" />
              </div>
            </div>
          </motion.div>

          {/* Token Cards */}
          {tokens.map((token) => (
            <TokenCard 
              key={token.address} 
              token={token}
              isSelected={selectedToken?.address === token.address}
              onClick={() => setSelectedToken(token)}
              onReaction={handleReaction}
              onFavorite={toggleFavorite}
            />
          ))}
        </div>

        <AddTokenModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToken={(token) => {
            setTokens([...tokens, {
              ...token,
              reactions: { rocket: 0, fire: 0, poop: 0 },
              isFavorite: false
            }]);
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
} 