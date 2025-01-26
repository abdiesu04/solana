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
      // First, validate the address format
      if (!address.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
        throw new Error('Invalid Solana address format');
      }

      let tokenAdded = false;

      // Try CoinGecko API first as it provides more comprehensive price data
      try {
        // First get the coin ID using the contract address
        const coinResponse = await axios.get(
          `https://api.coingecko.com/api/v3/coins/solana/contract/${address}`,
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        const coinData = coinResponse.data;
        
        // Get detailed market data for the coin
        const marketResponse = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinData.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        const marketData = marketResponse.data;

        onAddToken({
          address,
          name: marketData.name,
          symbol: marketData.symbol.toUpperCase(),
          price: marketData.market_data.current_price.usd,
          marketCap: marketData.market_data.market_cap.usd,
          volume24h: marketData.market_data.total_volume.usd,
          change24h: marketData.market_data.price_change_percentage_24h,
        });
        tokenAdded = true;
      } catch (coingeckoError) {
        console.warn('CoinGecko API failed:', coingeckoError);
        
        // Try Solscan as fallback
        try {
          const solscanResponse = await axios.get(
            `https://public-api.solscan.io/token/meta?tokenAddress=${address}`,
            {
              headers: {
                'Accept': 'application/json'
              }
            }
          );

          const tokenData = solscanResponse.data;

          // Get price data from Solscan
          const priceResponse = await axios.get(
            `https://public-api.solscan.io/market/token/${address}`,
            {
              headers: {
                'Accept': 'application/json'
              }
            }
          );

          const priceData = priceResponse.data;
          
          onAddToken({
            address,
            name: tokenData.name || 'Unknown Token',
            symbol: tokenData.symbol?.toUpperCase() || 'UNKNOWN',
            price: priceData.priceUsdt || 0,
            marketCap: priceData.marketCapFD || 0,
            volume24h: priceData.volume24h || 0,
            change24h: priceData.priceChange24h || 0,
          });
          tokenAdded = true;
        } catch (solscanError) {
          console.warn('Solscan API failed:', solscanError);
        }
      }

      // If both APIs failed, add token with minimal data
      if (!tokenAdded) {
        onAddToken({
          address,
          name: `Token ${address.slice(0, 6)}...${address.slice(-4)}`,
          symbol: 'TOKEN',
          price: 0,
          marketCap: 0,
          volume24h: 0,
          change24h: 0,
        });
      }

      onClose();
    } catch (error: any) {
      console.error('Error adding token:', error);
      setError(
        error.message === 'Invalid Solana address format'
          ? 'Please enter a valid Solana address'
          : 'Could not fetch token data. Please verify the contract address.'
      );
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