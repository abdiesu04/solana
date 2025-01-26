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
  const [panelWidth, setPanelWidth] = useState(420);
  const [isDragging, setIsDragging] = useState(false);
  
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

  const handleDragStart = () => {
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging) return;
    const newWidth = window.innerWidth - e.clientX;
    setPanelWidth(Math.min(Math.max(300, newWidth), window.innerWidth * 0.7));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] overflow-x-hidden">
      {/* Premium background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(97,87,255,0.07),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(255,185,63,0.05),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(37,47,74,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,47,74,0.4)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-20" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0),rgba(15,23,42,0.8))] pointer-events-none" />

      <Navbar
        user={user}
        onSearch={handleSearch}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
      
      <main className="flex flex-1 pt-16 relative">
        {/* Main content area - Charts */}
        <div 
          className={`flex-1 transition-all duration-500 ease-in-out transform ${
            selectedToken ? `mr-[${panelWidth}px] scale-[0.98] origin-left` : ''
          }`}
          style={{ marginRight: selectedToken ? `${panelWidth}px` : 0 }}
        >
          <div className="p-8">
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#6157FF] to-[#4F46E5]">
                  Token Dashboard
                </h1>
                <div className="absolute -bottom-2 left-0 w-1/2 h-px bg-gradient-to-r from-[#6157FF] to-transparent" />
              </div>
              <div className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-[#1E293B] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] border border-[#334155]">
                <span className="inline-block w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse shadow-[0_0_12px_rgba(74,222,128,0.4)]" />
                <span className="text-[#94A3B8] text-sm font-medium">Live Trading</span>
              </div>
            </div>

            <div className="relative">
              {/* Neumorphic container for content */}
              <div className="relative rounded-2xl bg-[#1E293B] p-8 shadow-[8px_8px_16px_rgba(0,0,0,0.3),-8px_-8px_16px_rgba(255,255,255,0.02)] border border-[#334155] hover:shadow-[12px_12px_24px_rgba(0,0,0,0.3),-12px_-12px_24px_rgba(255,255,255,0.02)] transition-shadow duration-500">
                <TokenGrid
                  onTokenSelect={setSelectedToken}
                  selectedToken={selectedToken}
                  onTokenReaction={handleTokenReaction}
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#6157FF] opacity-[0.03] rounded-full blur-3xl animate-pulse-slow" />
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#FFB93F] opacity-[0.03] rounded-full blur-3xl animate-pulse-slow" />
            </div>
          </div>
        </div>

        {/* Resizable panel for token details */}
        <div
          className={`fixed top-16 right-0 h-[calc(100vh-64px)] bg-[#1E293B] transform transition-all duration-500 ease-in-out border-l border-[#334155] shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.5)] backdrop-blur-sm ${
            selectedToken ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ width: `${panelWidth}px` }}
        >
          {selectedToken && (
            <div className="relative h-full">
              {/* Draggable resize handle */}
              <div
                className="absolute top-0 left-0 w-1 h-full cursor-col-resize group"
                onMouseDown={handleDragStart}
              >
                <div className="absolute top-0 left-0 w-4 h-full -ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-16 rounded-full bg-[#6157FF] opacity-20" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full bg-[#6157FF] opacity-40" />
                </div>
              </div>

              {/* Premium gradient line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#6157FF] via-[#4ADE80] to-transparent opacity-60" />
              
              {/* Close button - Enhanced neumorphic style */}
              <button
                onClick={() => setSelectedToken(null)}
                className="absolute top-6 right-6 z-50 p-3 bg-[#1E293B] rounded-xl text-[#94A3B8] hover:text-white transition-all duration-300 group shadow-[4px_4px_10px_rgba(0,0,0,0.3),-4px_-4px_10px_rgba(255,255,255,0.02)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(255,255,255,0.02)] border border-[#334155] hover:border-[#475569]"
              >
                <svg 
                  className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" 
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
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1E293B] rounded-xl text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 border border-[#334155] shadow-[4px_4px_10px_rgba(0,0,0,0.3)] translate-x-4 group-hover:translate-x-0">
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

        {/* Overlay for dragging */}
        {isDragging && (
          <div className="fixed inset-0 z-50 bg-transparent" />
        )}
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

      {/* Enhanced custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1E293B;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
          border: 2px solid #1E293B;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        ${isDragging ? `
          * {
            transition: none !important;
          }
        ` : ''}
      `}</style>
    </div>
  );
}