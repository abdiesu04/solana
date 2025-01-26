import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TokenCard from './TokenCard';
import TokenDetailChart from './TokenDetailChart';
import { Token } from '@/types/token';
import { coingeckoService } from '@/services/coingecko';
import AddTokenModal from './AddTokenModal';

export default function TokenGrid() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isAddTokenOpen, setIsAddTokenOpen] = useState(false);

  // Listen for new token additions
  useEffect(() => {
    const handleTokenAdded = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      coingeckoService.getTokenData(customEvent.detail)
        .then(tokenData => {
          if (tokenData) {
            setTokens(prev => [...prev, tokenData]);
          }
        })
        .catch(error => {
          console.error('Error adding token:', error);
        });
    };

    window.addEventListener('tokenAdded', handleTokenAdded);
    return () => window.removeEventListener('tokenAdded', handleTokenAdded);
  }, []);

  const handleReaction = (tokenId: string, reactionType: 'rocket' | 'fire' | 'poop') => {
    setTokens(prev => prev.map(token => {
      if (token.id === tokenId && token.reactions) {
        return {
          ...token,
          reactions: {
            ...token.reactions,
            [reactionType]: (token.reactions[reactionType] || 0) + 1
          }
        };
      }
      return token;
    }));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {/* Add Token Card */}
        <button
          onClick={() => setIsAddTokenOpen(true)}
          className="h-[200px] rounded-xl bg-gray-800 border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors duration-200 flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-12 h-12 rounded-full bg-gray-700 group-hover:bg-blue-500 transition-colors duration-200 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-gray-400 group-hover:text-blue-500 font-medium">Add Token</span>
        </button>

        {/* Token Cards */}
        {tokens.map(token => (
          <div
            key={token.id}
            className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedToken(token)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={token.image} alt={token.name} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-semibold text-white">{token.name}</h3>
                  <p className="text-sm text-gray-400">{token.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </p>
                <p className={`text-sm ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Mini Chart Placeholder */}
            <div className="h-20 bg-gray-700/50 rounded-lg mb-4" />

            {/* Reactions */}
            <div className="flex gap-2">
              {token.reactions && Object.entries(token.reactions).map(([type, count]) => (
                <button
                  key={type}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReaction(token.id, type as 'rocket' | 'fire' | 'poop');
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <span>{type === 'rocket' ? '🚀' : type === 'fire' ? '🔥' : '💩'}</span>
                  <span className="text-sm text-gray-300">{count}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Token Modal */}
      <AddTokenModal
        isOpen={isAddTokenOpen}
        onClose={() => setIsAddTokenOpen(false)}
      />

      {/* Token Detail Modal */}
      {selectedToken && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <TokenDetailChart
              token={selectedToken}
              onClose={() => setSelectedToken(null)}
              onReaction={(type) => handleReaction(selectedToken.id, type as 'rocket' | 'fire' | 'poop')}
            />
          </div>
        </div>
      )}
    </>
  );
} 