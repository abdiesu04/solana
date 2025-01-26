import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircleIcon, 
  WalletIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface UserProfileProps {
  user: {
    address: string;
    username?: string;
    avatar?: string;
  };
  onLogout: () => void;
  onNavigate: (route: string) => void;
}

export default function UserProfile({ user, onLogout, onNavigate }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'portfolio', label: 'Portfolio', icon: ChartBarIcon, route: '/portfolio' },
    { id: 'watchlist', label: 'Watchlist', icon: StarIcon, route: '/watchlist' },
    { id: 'wallet', label: 'Wallet', icon: WalletIcon, route: '/wallet' },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon, route: '/settings' },
  ];

  return (
    <div className="relative">
      {/* Profile Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-700/50"
      >
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.username || 'User avatar'} 
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <UserCircleIcon className="w-8 h-8" />
        )}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium">
            {user.username || 'Anonymous'}
          </p>
          <p className="text-xs text-gray-400 truncate max-w-[120px]">
            {user.address}
          </p>
        </div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 p-2 rounded-xl bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 shadow-xl z-50"
          >
            {/* User Info */}
            <div className="p-4 mb-2 rounded-lg bg-gray-800/50">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.username || 'User avatar'} 
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="w-10 h-10" />
                )}
                <div>
                  <p className="font-medium text-white">
                    {user.username || 'Anonymous'}
                  </p>
                  <p className="text-xs text-gray-400 truncate max-w-[180px]">
                    {user.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onNavigate(item.route);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}

              {/* Logout Button */}
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 