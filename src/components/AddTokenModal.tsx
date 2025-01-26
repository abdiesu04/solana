import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import { Token } from '@/types/token';

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToken: (token: Token) => void;
}

export default function AddTokenModal({ isOpen, onClose, onAddToken }: AddTokenModalProps) {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Mock API call to fetch token data
      const mockToken: Token = {
        address,
        name: 'Mock Token',
        symbol: 'MTK',
        price: 100,
        marketCap: 1000000,
        volume24h: 500000,
        change24h: 5,
        votes: 0,
        reactions: {
          rocket: 0,
          fire: 0,
          poop: 0
        },
        isPinned: false,
        isFavorite: false
      };

      onAddToken(mockToken);
      onClose();
    } catch (err) {
      setError('Failed to add token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Add Token</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">
                Token Contract Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-solana-purple"
                placeholder="Enter token address"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-solana-purple text-white rounded-lg hover:bg-solana-purple/80 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Adding...' : 'Add Token'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
} 