'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import TokenGrid from '@/components/TokenGrid';
import AddTokenModal from '@/components/AddTokenModal';

export default function Page() {
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

  const handleAddToken = (token: {
    address: string;
    name: string;
    symbol: string;
    price: number;
    marketCap: number;
    volume24h: number;
    change24h: number;
  }) => {
    console.log('Token added:', token);
    window.dispatchEvent(new CustomEvent('tokenAdded', { detail: token }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        user={user}
        onSearch={handleSearch}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
      <main className="flex-1 pt-20">
        <TokenGrid />
      </main>
      <AddTokenModal
        isOpen={isAddTokenOpen}
        onClose={() => setIsAddTokenOpen(false)}
        onAddToken={handleAddToken}
      />
    </div>
  );
}