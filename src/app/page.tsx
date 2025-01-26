'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import TokenGrid from '@/components/TokenGrid';
import TokenDetailChart from '@/components/TokenDetailChart';
import AddTokenModal from '@/components/AddTokenModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Token } from '@/types/token';

export default function Home() {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isAddTokenOpen, setIsAddTokenOpen] = useState(false);
  
  // Mock user data
  const user = {
    address: '0x1234...5678',
    username: 'Demo User',
    isAuthenticated: false,
  };

  useEffect(() => {
    const handleOpenModal = () => setIsAddTokenOpen(true);
    window.addEventListener('openAddTokenModal', handleOpenModal);
    return () => window.removeEventListener('openAddTokenModal', handleOpenModal);
  }, []);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  const handleLogin = () => {
    console.log('Logging in...');
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleNavigate = (route: string) => {
    console.log('Navigating to:', route);
  };

  const handleAddToken = (token: Token) => {
    window.dispatchEvent(new CustomEvent('tokenAdded', { detail: token }));
    setIsAddTokenOpen(false);
  };

  const handleTokenReaction = (token: Token, reaction: 'rocket' | 'fire' | 'poop') => {
    const updatedToken = {
      ...token,
      reactions: {
        ...token.reactions,
        [reaction]: (token.reactions?.[reaction] || 0) + 1
      }
    };
    window.dispatchEvent(new CustomEvent('tokenUpdated', { detail: updatedToken }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#131B2C]">
      {/* Premium background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(97,87,255,0.05),transparent_70%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,185,63,0.03),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(37,47,74,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,47,74,0.5)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none opacity-30" />

      <Navbar
        user={user}
        onSearch={handleSearch}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
      
      <main className="flex flex-1 pt-16 relative">
        {/* Main content area - Charts */}
        <div className={`flex-1 transition-all duration-500 ease-in-out ${selectedToken ? 'mr-[420px]' : ''}`}>
          <div className="p-8">
            <div className="flex items-center space-x-6 mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#6157FF] to-[#4F46E5]">
                Token Dashboard
              </h1>
              <div className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-[#1C2538] shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] border border-[#2A3447]">
                <span className="inline-block w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                <span className="text-[#94A3B8] text-sm font-medium">Live Trading</span>
              </div>
            </div>

            <div className="relative">
              {/* Neumorphic container for content */}
              <div className="relative rounded-2xl bg-[#1C2538] p-8 shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.02)] border border-[#2A3447]">
                <TokenGrid
                  onTokenSelect={setSelectedToken}
                  selectedToken={selectedToken}
                  onTokenReaction={handleTokenReaction}
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#6157FF] opacity-[0.03] rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FFB93F] opacity-[0.03] rounded-full blur-3xl" />
            </div>
          </div>
        </div>

        {/* Sliding panel for token cards */}
        <div
          className={`fixed top-16 right-0 w-[420px] h-[calc(100vh-64px)] bg-[#1C2538] transform transition-transform duration-500 ease-in-out border-l border-[#2A3447] shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.3)] ${
            selectedToken ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {selectedToken && (
            <div className="relative h-full">
              {/* Premium gradient line */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#6157FF] via-[#4ADE80] to-transparent opacity-50" />
              
              {/* Close button - Neumorphic style */}
              <button
                onClick={() => setSelectedToken(null)}
                className="absolute top-6 right-6 z-50 p-3 bg-[#1C2538] rounded-xl text-[#94A3B8] hover:text-white transition-all duration-300 group shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.02)] border border-[#2A3447] hover:border-[#3A4557]"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1C2538] rounded-xl text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-[#2A3447] shadow-[4px_4px_8px_rgba(0,0,0,0.2)]">
                  Close Panel
                </span>
              </button>

              <div className="p-6 h-full overflow-y-auto custom-scrollbar">
                <TokenDetailChart
                  token={selectedToken}
                  onClose={() => setSelectedToken(null)}
                  onReaction={(reaction) => handleTokenReaction(selectedToken, reaction)}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Token Modal */}
      <AnimatePresence>
        {isAddTokenOpen && (
          <AddTokenModal
            isOpen={isAddTokenOpen}
            onClose={() => setIsAddTokenOpen(false)}
            onAddToken={handleAddToken}
          />
        )}
      </AnimatePresence>

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1C2538;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2A3447;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3A4557;
        }
      `}</style>
    </div>
  );
}