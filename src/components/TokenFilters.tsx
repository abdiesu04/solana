import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FunnelIcon, 
  ChartBarIcon, 
  FireIcon, 
  StarIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

type FilterOption = 'all' | 'popular' | 'gainers' | 'trending' | 'recent';

interface TokenFiltersProps {
  onFilterChange: (filter: FilterOption) => void;
  activeFilter: FilterOption;
}

export default function TokenFilters({ onFilterChange, activeFilter }: TokenFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filters: { id: FilterOption; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'all', label: 'All Tokens', icon: FunnelIcon },
    { id: 'popular', label: 'Most Voted', icon: StarIcon },
    { id: 'gainers', label: 'Top Gainers', icon: ChartBarIcon },
    { id: 'trending', label: 'Trending', icon: FireIcon },
    { id: 'recent', label: 'Recently Added', icon: ClockIcon },
  ];

  return (
    <div className="relative">
      {/* Mobile Filter Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
      >
        <FunnelIcon className="w-5 h-5" />
        <span>Filter</span>
      </motion.button>

      {/* Desktop Filter Tabs */}
      <div className="hidden md:flex items-center gap-2 p-2 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/50">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onFilterChange(filter.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{filter.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile Filter Menu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
        className={`
          absolute top-full left-0 right-0 mt-2 p-2 rounded-xl 
          bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 
          shadow-xl z-50 md:hidden
          ${isOpen ? 'block' : 'hidden'}
        `}
      >
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <motion.button
              key={filter.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onFilterChange(filter.id);
                setIsOpen(false);
              }}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-lg w-full mb-1 last:mb-0
                ${isActive 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{filter.label}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
} 