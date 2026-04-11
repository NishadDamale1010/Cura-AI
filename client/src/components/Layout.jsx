import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity, AlertTriangle, BrainCircuit, Bot, ChevronLeft, ChevronRight,
  ClipboardList, HeartPulse, LogOut, Map, Menu, MessageCircle,
  PlusCircle, Search, ShieldCheck, Stethoscope, Upload, Bell, X,
  LayoutDashboard, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const doctorNav = [
  { to: '/doctor/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/doctor/reports', label: 'Case Manager', icon: ClipboardList },
  { to: '/doctor/map', label: 'Risk Map', icon: Map },
  { to: '/doctor/alerts', label: 'Alerts', icon: AlertTriangle },
  { to: '/doctor/ai-engine', label: 'AI Engine', icon: BrainCircuit },
  { to: '/doctor/disease-predict', label: 'Disease Predict', icon: Stethoscope },
  { to: '/healthbot', label: 'HealthBot', icon: Bot },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
];

const patientNav = [
  { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patient/submit', label: 'Symptom Logger', icon: PlusCircle },
  { to: '/patient/vitals', label: 'Vitals', icon: HeartPulse },
  { to: '/patient/uploads', label: 'Uploads', icon: Upload },
  { to: '/patient/nearby', label: 'Nearby Risk', icon: Map },
  { to: '/patient/disease-predict', label: 'Disease Predict', icon: Stethoscope },
  { to: '/healthbot', label: 'HealthBot', icon: Bot },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const nav = user?.role === 'doctor' ? doctorNav : patientNav;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen md:flex relative font-sans z-0 selection:bg-cyan-500/30">
      {/* 3D Animated Background Primative */}
      <div className="mesh-bg z-[-1] pointer-events-none"></div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>

      {/* Floating Glass Sidebar */}
      <aside className={`
        fixed md:sticky top-4 left-4 z-50 h-[calc(100vh-2rem)]
        ${mobileOpen ? 'translate-x-0' : '-translate-x-[120%]'} md:translate-x-0
        ${collapsed ? 'md:w-[80px]' : 'md:w-[260px]'} w-[260px]
        glass-panel
        transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col shadow-soft-lg md:mx-4
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-white/40 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 min-w-[40px] rounded-[14px] bg-gradient-to-br from-cyan-400 to-blue-600 text-white grid place-items-center shadow-glow-cyan">
              <ShieldCheck size={22} fill="white" className="text-blue-600" />
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">
                <h1 className="font-extrabold text-xl font-display tracking-tight text-slate-800">Cura<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">AI</span></h1>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Intelligence</p>
              </motion.div>
            )}
          </div>
          <button className="hidden md:flex items-center justify-center h-7 w-7 rounded-full hover:bg-white/50 text-slate-400 transition-colors shadow-sm border border-white/50" onClick={() => setCollapsed((v) => !v)}>
             {collapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
          </button>
          <button className="md:hidden text-slate-400 hover:text-slate-700 bg-white/50 rounded-full p-1" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-x-hidden overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3.5 px-3 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 relative font-display tracking-wide
                  ${active ? 'text-white shadow-glow-cyan' : 'text-slate-500 hover:bg-white/50 hover:text-cyan-600'}
                  ${collapsed ? 'justify-center' : ''}`}
              >
                {active && (
                  <motion.div layoutId="activeNavBubble" className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }} />
                )}
                <div className={`relative z-10 flex items-center justify-center ${active ? 'text-white' : ''}`}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                </div>
                {!collapsed && <span className="relative z-10 leading-none">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/40 mt-auto">
          {collapsed ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white grid place-items-center text-sm font-black shadow-glow-cyan">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button onClick={handleLogout} className="h-10 w-10 rounded-2xl hover:bg-rose-500 hover:text-white hover:shadow-glow-violet text-slate-400 grid place-items-center transition-all duration-300" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2 bg-white/40 border border-white/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 min-w-[40px] rounded-[14px] bg-gradient-to-br from-cyan-400 to-blue-600 text-white grid place-items-center text-sm font-black shadow-glow-cyan">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate font-display">{user?.name}</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-cyan-600">{user?.role}</p>
              </div>
              <button onClick={handleLogout} className="h-9 w-9 rounded-xl hover:bg-rose-500 hover:text-white text-slate-400 grid place-items-center transition-all duration-300 group" title="Logout">
                <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content wrapper */}
      <main className="flex-1 min-h-screen md:p-6 p-4 flex flex-col md:max-w-[calc(100vw-310px)] relative z-10 w-full overflow-hidden">
        {/* Floating Topbar */}
        <div className="glass-panel px-5 py-3.5 mb-6 flex items-center justify-between gap-4 sticky top-4 z-40 lg:top-0 lg:mt-2 lg:mx-1">
          <div className="flex items-center gap-3 flex-1">
            <button className="md:hidden h-10 w-10 rounded-xl bg-white/50 text-slate-600 grid place-items-center hover:bg-white shadow-soft" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="relative flex-1 max-w-xl group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input className="w-full bg-white/40 border border-white/60 rounded-2xl pl-11 pr-4 py-2.5 text-sm font-medium outline-none placeholder-slate-400 transition-all focus:border-cyan-300 focus:ring-4 focus:ring-cyan-500/10 focus:bg-white shadow-inner hover:bg-white/60"
                placeholder="Search medical records, patients, active outbreaks..." />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative h-10 w-10 rounded-2xl hover:bg-white hover:shadow-soft grid place-items-center text-slate-500 transition-all border border-transparent hover:border-white/60 group">
              <Bell size={20} className="group-hover:text-cyan-600 transition-colors" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            </button>
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-300/30">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 font-display">{user?.name}</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-cyan-600">{user?.role}</p>
              </div>
              <div className="h-10 w-10 rounded-[14px] bg-gradient-to-br from-cyan-400 to-blue-500 text-white grid place-items-center text-sm font-black shadow-glow-cyan border-[3px] border-white/40 hover:scale-105 transition-transform cursor-pointer">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>

        {/* Page content wrapper with floating animation */}
        <motion.div 
          key={location.pathname} 
          initial={{ opacity: 0, y: 15, scale: 0.99 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 w-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
