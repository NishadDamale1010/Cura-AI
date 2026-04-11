import { motion } from 'framer-motion';
import {
  Bell,
  Search,
  Settings,
  User,
} from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 md:left-64 h-20 z-30 glass-light border-b"
      style={{ borderColor: 'var(--card-border)' }}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              placeholder="Search patients, regions, outbreaks..."
              className="input-field w-full pl-10 pr-4 py-2 text-sm placeholder-opacity-50"
            />
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Live Badge */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(6, 214, 160, 0.2)',
              border: '1px solid rgba(6, 214, 160, 0.4)',
              color: 'rgb(6, 214, 160)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'rgb(6, 214, 160)' }}
            />
            Live +24/7
          </motion.div>

          {/* Notification Bell */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg hover:bg-white/5 transition-all"
          >
            <Bell size={20} />
            <motion.span
              animate={{ scale: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex-center text-xs font-bold text-white"
            >
              12
            </motion.span>
          </motion.button>

          {/* Settings Icon */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-white/5 transition-all"
          >
            <Settings size={20} />
          </motion.button>

          {/* Profile Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-center cursor-pointer glow-primary"
          >
            <User size={20} className="text-white" />
          </motion.div>
        </div>
      </div>

      {/* Animated border on bottom */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ width: '100%' }}
      />
    </motion.nav>
  );
}
