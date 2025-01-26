import { motion } from 'framer-motion';
import { useState } from 'react';
import AddTokenModal from './AddTokenModal';
import TokenCard from './TokenCard';

interface Token {
  address: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
}

export default function TokenGrid() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Add Token Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="h-48 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-6 flex items-center justify-center group hover:border-blue-500 transition-all duration-300">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-blue-500"
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
              <span className="text-gray-400 group-hover:text-blue-500 transition-all duration-300">
                Add Token
              </span>
            </div>
          </div>
        </motion.div>

        {/* Token Cards */}
        {tokens.map((token) => (
          <TokenCard key={token.address} token={token} />
        ))}
      </div>

      <AddTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToken={(token) => {
          setTokens([...tokens, token]);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
} 