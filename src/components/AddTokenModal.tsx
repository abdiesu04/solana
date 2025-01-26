import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { Fragment, useState } from 'react';

interface Token {
  address: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
}

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToken: (token: Token) => void;
}

export default function AddTokenModal({
  isOpen,
  onClose,
  onAddToken,
}: AddTokenModalProps) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the wrapped SOL address as an example
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${address}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      const tokenData = response.data[address];
      if (!tokenData) {
        throw new Error('Token not found');
      }

      onAddToken({
        address,
        name: 'SOL Token', // For demonstration
        symbol: 'SOL',
        price: tokenData.usd,
        marketCap: tokenData.usd_market_cap || 0,
        volume24h: tokenData.usd_24h_vol || 0,
        change24h: tokenData.usd_24h_change || 0,
      });
    } catch (error) {
      console.error('API Error:', error);
      setError('Failed to fetch token data. Try this address: So11111111111111111111111111111111111111112');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-gray-900 rounded-xl border border-gray-700 p-6 w-full max-w-md transform transition-all">
                <Dialog.Title className="text-xl font-semibold text-white mb-4">
                  Add Token
                </Dialog.Title>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
                        Contract Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Solana contract address"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Adding...' : 'Add Token'}
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 