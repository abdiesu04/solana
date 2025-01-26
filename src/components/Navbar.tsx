'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  SunIcon, 
  MoonIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
  user: {
    address: string;
    username?: string;
    avatar?: string;
    isAuthenticated?: boolean;
  };
  onSearch: (query: string) => void;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (route: string) => void;
}

export default function Navbar({ user, onSearch, onLogin, onLogout, onNavigate }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50" />

      {/* Content */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex-shrink-0 flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onNavigate('/')}
              >
                {/* Solana Logo */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#9945FF] to-[#14F195] p-[1px]">
                  <div className="w-full h-full rounded-lg dark:bg-gray-900 bg-white flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 128 128" fill="none">
                      <path
                        d="M28 40L64 20L100 40L64 60L28 40Z"
                        className="fill-current dark:text-white text-gray-900"
                      />
                      <path
                        d="M100 40V88L64 108V60L100 40Z"
                        className="fill-current text-purple-500 dark:text-purple-400"
                      />
                      <path
                        d="M28 40V88L64 108V60L28 40Z"
                        className="fill-current text-green-500 dark:text-green-400"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                  Solana Explorer
                </span>
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {/* Search Bar */}
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tokens..."
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 
                    rounded-lg py-2 pl-10 pr-4 
                    text-gray-900 dark:text-gray-100 
                    placeholder-gray-500 dark:placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                    transition-all duration-200"
                />
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 
                  text-gray-900 dark:text-gray-100
                  hover:bg-gray-200 dark:hover:bg-gray-700/50 
                  transition-colors duration-200"
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </motion.button>

              {/* Auth Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={user.isAuthenticated ? onLogout : onLogin}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9945FF] to-[#14F195] 
                  text-white font-medium shadow-lg shadow-purple-500/20
                  hover:shadow-xl hover:shadow-purple-500/30 
                  transition-all duration-200"
              >
                {user.isAuthenticated ? 'Sign Out' : 'Sign In'}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-900 dark:text-gray-100"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          className="md:hidden overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tokens..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 
                  border border-gray-200 dark:border-gray-700
                  rounded-lg py-2 pl-10 pr-4 
                  text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg
                text-gray-900 dark:text-gray-100
                hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? (
                <>
                  <SunIcon className="w-5 h-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <MoonIcon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {/* Mobile Auth Button */}
            <button
              onClick={user.isAuthenticated ? onLogout : onLogin}
              className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[#9945FF] to-[#14F195] 
                text-white font-medium text-center"
            >
              {user.isAuthenticated ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
        </motion.div>
      </div>
    </nav>
  );
} 