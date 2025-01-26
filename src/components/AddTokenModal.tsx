'use client'

import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import axios from 'axios';

const BIRDEYE_API_KEY = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
const BIRDEYE_API_URL = 'https://public-api.birdeye.so/defi';

interface Token {
  address: string;
  name: string;
  symbol: string;
  logoURI: string;
  verified: boolean;
  price?: number;
}

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTokenModal({ isOpen, onClose }: AddTokenModalProps) {
  const [searchMode, setSearchMode] = useState<'address' | 'name'>('address');
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await axios.get(`${BIRDEYE_API_URL}/token/list`, {
          params: { name: query },
          headers: { 
            'X-API-KEY': BIRDEYE_API_KEY
          }
        });
        
        if (response.data?.data?.tokens) {
          setSearchResults(response.data.data.tokens.filter((t: Token) => t.verified));
        }
      } catch (error) {
        console.error('Search error:', error);
        setError('Failed to search tokens. Please try again.');
      }
    }, 300),
    []
  );

  const validateTokenAddress = async (address: string): Promise<Token | null> => {
    try {
      const response = await axios.get(`${BIRDEYE_API_URL}/token/info`, {
        params: { address },
        headers: { 
          'X-API-KEY': BIRDEYE_API_KEY
        }
      });

      if (response.data?.data) {
        return {
          address,
          name: response.data.data.name,
          symbol: response.data.data.symbol,
          logoURI: response.data.data.logoURI,
          verified: response.data.data.verified ?? false,
          price: response.data.data.price
        };
      }
      return null;
    } catch (error) {
      console.error('Validation error:', error);
      return null;
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setError('');

    if (searchMode === 'name') {
      setLoading(true);
      await debouncedSearch(value);
      setLoading(false);
    }
  };

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setInput(token.address);
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const normalizedAddress = input.trim();
      
      // Validate address format
      if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(normalizedAddress)) {
        throw new Error('Invalid Solana token address format');
      }

      // Validate token with Birdeye
      const tokenData = await validateTokenAddress(normalizedAddress);
      if (!tokenData) {
        throw new Error('Token not found. Please verify the address.');
      }

      if (!tokenData.verified) {
        setError('Warning: This token is not verified. Trade with caution.');
        // Continue anyway after warning
      }

      // Create token object
      const token = {
        ...tokenData,
        description: description || '',
        reactions: { rocket: 0, fire: 0, poop: 0 },
        votes: 0,
        isPinned: false,
        isFavorite: false
      };

      // Store in localStorage
      const storedTokens = JSON.parse(localStorage.getItem('tokens') || '[]');
      localStorage.setItem('tokens', JSON.stringify([...storedTokens, token]));

      // Dispatch event
      window.dispatchEvent(new CustomEvent('tokenAdded', { 
        detail: token
      }));

      // Reset form
      setInput('');
      setDescription('');
      setSelectedToken(null);
      onClose();
    } catch (error) {
      console.error('Error adding token:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to add token. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Add Token</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => {
              setSearchMode('address');
              setInput('');
              setSearchResults([]);
              setError('');
            }}
            className={`px-4 py-2 rounded-lg ${
              searchMode === 'address' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            Contract Address
          </button>
          <button
            onClick={() => {
              setSearchMode('name');
              setInput('');
              setSearchResults([]);
              setError('');
            }}
            className={`px-4 py-2 rounded-lg ${
              searchMode === 'name' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            Search by Name
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="token-input" className="block text-sm font-medium text-gray-400 mb-1">
                {searchMode === 'address' ? 'Token Contract Address' : 'Search Token'}
              </label>
              <input
                id="token-input"
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder={searchMode === 'address' ? 'Enter Solana token address' : 'Search by token name or symbol'}
                className={`w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 ${
                  selectedToken?.verified === false ? 'border-red-500' : 'border-gray-600'
                }`}
                required
              />
              
              {/* Search Results Dropdown */}
              {searchMode === 'name' && searchResults.length > 0 && (
                <div className="absolute w-full mt-1 bg-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((token) => (
                    <button
                      key={token.address}
                      type="button"
                      onClick={() => handleTokenSelect(token)}
                      className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-600 transition-colors"
                    >
                      {token.logoURI && (
                        <img src={token.logoURI} alt={token.symbol} className="w-6 h-6 rounded-full" />
                      )}
                      <div className="flex-1 text-left">
                        <div className="text-white">{token.symbol}</div>
                        <div className="text-sm text-gray-400">{token.name}</div>
                      </div>
                      {token.verified && (
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a short description"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 resize-none h-24"
              />
            </div>

            {error && (
              <div className={`text-sm ${error.includes('Warning') ? 'text-yellow-500' : 'text-red-500'}`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  {searchMode === 'name' && searchResults.length === 0 ? 'Searching...' : 'Adding Token...'}
                </div>
              ) : (
                'Add Token'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 