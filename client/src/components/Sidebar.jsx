import { motion } from 'framer-motion';
import {
  BarChart3,
  Brain,
  Globe,
  Grid3x3,
  Heatmap,
  LogOut,
  Map,
  Settings,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: Grid3x3 },
  { id: 'case-manager', label: 'Case Manager', icon: BarChart3 },
  { id: 'risk-map', label: 'Risk Map', icon: Map },
  { id: 'analytics', label: 'Analytics', icon: Heatmap },
  { id: 'ai-engine', label: 'AI Engine', icon: Brain },
];

export default function Sidebar({ activeMenu, onMenuChange }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="hidden md:flex md:flex-col fixed left-0 top-0 h-screen w-64 glass-light z-40 overflow-y-auto scrollbar-thin"
    >
      {/* Logo & Branding */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--card-border)' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex-center flex-shrink-0 glow-primary">
            <Globe size={24} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight">Cura-AI</h2>
            <p className="text-xs opacity-60">Health Surveillance</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-50 px-3 py-2">
          Monitoring
        </p>

        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ x: 4 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-400/50 text-indigo-300'
                  : 'hover:bg-white/5 text-opacity-70'
              }`}
              style={
                isActive
                  ? {
                      boxShadow: '0 0 20px rgba(129, 140, 248, 0.4)',
                    }
                  : {}
              }
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeMenu"
                  className="ml-auto w-2 h-2 rounded-full bg-indigo-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Settings & Theme Toggle */}
      <div className="p-4 space-y-2 border-t" style={{ borderColor: 'var(--card-border)' }}>
        <motion.button
          whileHover={{ x: 4 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-300"
        >
          <Settings size={20} />
          <span className="text-sm font-medium">Settings</span>
        </motion.button>

        <motion.button
          onClick={toggleTheme}
          whileHover={{ x: 4 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-300"
        >
          <div className="relative w-5 h-5">
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.4 }}
            >
              {isDark ? (
                <span>🌙</span>
              ) : (
                <span>☀️</span>
              )}
            </motion.div>
          </div>
          <span className="text-sm font-medium">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ x: 4 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </motion.button>
      </div>
    </motion.aside>
  );
}
