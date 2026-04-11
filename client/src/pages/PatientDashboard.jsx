import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Activity, ShieldCheck, MapPin, TrendingUp, AlertTriangle,
  Droplets, Stethoscope, Upload, Phone, Siren,
  CheckCircle2, CircleAlert, Wind, Building2, Navigation,
  Clock, Lightbulb, HeartPulse, Brain, ArrowUpRight, Sparkles
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const asArray = (v) => (Array.isArray(v) ? v : []);

const healthTrendData = [
  { date: 'Mon', Fever: 38, Cough: 45, Fatigue: 10 },
  { date: 'Tue', Fever: 65, Cough: 50, Fatigue: 30 },
  { date: 'Wed', Fever: 48, Cough: 55, Fatigue: 50 },
  { date: 'Thu', Fever: 40, Cough: 35, Fatigue: 62 },
  { date: 'Fri', Fever: 55, Cough: 40, Fatigue: 78 },
  { date: 'Sat', Fever: 42, Cough: 30, Fatigue: 60 },
  { date: 'Today', Fever: 35, Cough: 50, Fatigue: 45 },
];

const riskTrendData = [
  { day: 'D1', risk: 22 }, { day: 'D2', risk: 35 }, { day: 'D3', risk: 28 },
  { day: 'D4', risk: 45 }, { day: 'D5', risk: 38 }, { day: 'D6', risk: 52 },
  { day: 'D7', risk: 41 },
];

const outbreakZones = [
  { name: 'Pimpri', risk: 'High', top: '22%', left: '30%', color: '#ef4444', pulse: true },
  { name: 'Hinjewadi', risk: 'Medium', top: '55%', left: '35%', color: '#f59e0b', pulse: false },
  { name: 'Kharadi', risk: 'Low', top: '30%', left: '75%', color: '#22c55e', pulse: false },
];

const healthTips = [
  { icon: Droplets, text: 'Drink 8–10 glasses of filtered water daily', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: ShieldCheck, text: 'Use mosquito repellents during dusk and dawn', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { icon: Heart, text: 'Maintain hand hygiene — wash for 20 seconds', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Wind, text: 'Avoid areas with stagnant water accumulation', color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

const quickActions = [
  { icon: Stethoscope, label: 'Book Appointment', to: '/patient/submit', from: 'from-cyan-500', to_: 'to-blue-500', shadow: 'shadow-glow-cyan' },
  { icon: Upload, label: 'Upload Reports', to: '/patient/uploads', from: 'from-violet-500', to_: 'to-purple-500', shadow: 'shadow-glow-violet' },
  { icon: Phone, label: 'Contact Doctor', to: '/messages', from: 'from-emerald-500', to_: 'to-teal-500', shadow: '' },
  { icon: Siren, label: 'Emergency SOS', to: '/patient/nearby', from: 'from-rose-500', to_: 'to-red-600', shadow: '' },
];

const STAT_CARDS = [
  {
    label: 'Health Status',
    value: 'Low Risk',
    sub: 'Updated 5 min ago',
    icon: ShieldCheck, iconBg: 'from-emerald-500 to-teal-500',
    valueColor: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    border: 'border-emerald-500/20',
  },
  {
    label: 'Active Cases Near You',
    value: '12',
    sub: 'Last 7 days',
    icon: Activity, iconBg: 'from-violet-500 to-purple-500',
    valueColor: 'text-violet-400', glow: '',
    border: 'border-violet-500/20',
  },
  {
    label: 'Predicted Risk (7 days)',
    value: 'Medium',
    sub: 'Dengue +20% trend',
    icon: TrendingUp, iconBg: 'from-amber-500 to-orange-500',
    valueColor: 'text-amber-400', glow: '',
    border: 'border-amber-500/20',
  },
  {
    label: 'Nearest Clinic',
    value: '2.3 km',
    sub: 'Sahyadri Hospital',
    icon: Building2, iconBg: 'from-blue-500 to-cyan-500',
    valueColor: 'text-blue-400', glow: '',
    border: 'border-blue-500/20',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-bold text-slate-400 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const firstName = user?.name?.split(' ')[0] || 'Patient';

  useEffect(() => {
    api.get('/api/alerts').catch(() => ({ data: [] })).then((a) => {
      const alertPayload = Array.isArray(a.data) ? a.data : a.data?.alerts;
      setAlerts(asArray(alertPayload));
    });
  }, []);

  const allAlerts = alerts.length ? alerts.slice(0, 3) : [
    { _id: 'default-1', disease: 'Dengue Alert', message: 'Cases rising in your area', severity: 'high', region: '10 min ago' },
    { _id: 'default-2', disease: 'Flu Warning', message: 'Seasonal flu cases increasing', severity: 'medium', region: '2 hrs ago' },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">

      {/* ── Hero Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 border border-white/10 p-6 md:p-8 shadow-xl">
        {/* Glow orb */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-10 left-20 w-48 h-48 rounded-full bg-violet-500/15 blur-2xl" />

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-display">AI Health Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-display text-white leading-tight">
              Hello, {firstName} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1.5">Your real-time health and outbreak intelligence overview</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2.5">
              <MapPin size={14} className="text-emerald-400" />
              <span className="text-sm text-white font-medium">Pune, Maharashtra</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-emerald-300 font-semibold">Live Monitor</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} custom={i} variants={cardVariants} initial="hidden" animate="visible"
              className={`relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border-2 ${card.border} p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${card.glow} group`}>
              {/* gradient orb */}
              <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${card.iconBg} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />
              <div className="flex items-start justify-between mb-3">
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${card.iconBg} grid place-items-center shadow-lg`}>
                  <Icon size={20} className="text-white" />
                </div>
                <ArrowUpRight size={16} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{card.label}</p>
              <p className={`text-2xl font-black font-display ${card.valueColor}`}>{card.value}</p>
              <p className="text-[11px] text-slate-400 mt-1">{card.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Middle Row ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid lg:grid-cols-[1.5fr_0.75fr_0.75fr] gap-4">

        {/* Health Trend Chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <HeartPulse size={18} className="text-rose-500" />
              <h3 className="font-bold text-slate-800 font-display">Your Health Trend</h3>
            </div>
            <span className="badge bg-slate-100 text-slate-500 border-slate-200 text-xs">Last 7 Days</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer>
              <LineChart data={healthTrendData}>
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <CartesianGrid stroke="#f1f5f9" vertical={false} strokeDasharray="4 2" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Fever" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} />
                <Line type="monotone" dataKey="Cough" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
                <Line type="monotone" dataKey="Fatigue" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 justify-center">
            {[['#ef4444', 'Fever'], ['#3b82f6', 'Cough'], ['#10b981', 'Fatigue']].map(([color, name]) => (
              <div key={name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-slate-500 font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Trend Mini */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={16} className="text-violet-500" />
            <h3 className="font-bold text-slate-800 font-display text-sm">AI Risk Score</h3>
          </div>
          <div className="h-32 mb-3">
            <ResponsiveContainer>
              <AreaChart data={riskTrendData}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="risk" stroke="#8b5cf6" strokeWidth={2.5}
                  fill="url(#riskGrad)" dot={false} />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-center">
            <p className="text-2xl font-black font-display text-violet-600">41</p>
            <p className="text-xs text-violet-500 font-semibold mt-0.5">/ 100 Risk Index</p>
          </div>
          <Link to="/patient/disease-predict" className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors">
            <Brain size={13} /> Run AI Prediction
          </Link>
        </div>

        {/* Live Outbreak Map */}
        <div className="card p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-rose-500" />
              <h3 className="font-bold text-slate-800 font-display text-sm">Live Outbreak Map</h3>
            </div>
            <Link to="/patient/nearby" className="text-xs text-cyan-600 font-bold flex items-center gap-1 hover:text-cyan-700">
              Open <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-100"
            style={{ background: 'radial-gradient(ellipse at 40% 40%, #dbeafe 0%, #ecfdf5 50%, #f0fdf4 100%)' }}>
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            {outbreakZones.map((zone) => (
              <div key={zone.name} className="absolute flex flex-col items-center" style={{ top: zone.top, left: zone.left }}>
                {zone.pulse && <span className="h-6 w-6 rounded-full animate-ping absolute opacity-40" style={{ backgroundColor: zone.color }} />}
                <span className="h-5 w-5 rounded-full relative z-10 border-2 border-white shadow-lg" style={{ backgroundColor: zone.color }} />
                <span className="text-[10px] font-black mt-1 bg-white/95 backdrop-blur px-2 py-0.5 rounded-full shadow-sm relative z-10 whitespace-nowrap border border-slate-100">{zone.name}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${zone.risk === 'High' ? 'bg-red-500 text-white' : zone.risk === 'Medium' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'}`}>
                  {zone.risk}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Bottom Row ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="grid lg:grid-cols-3 gap-4">

        {/* Alerts */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 font-display flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" /> Recent Alerts
            </h3>
            <Link to="/patient/nearby" className="text-xs text-cyan-600 font-bold hover:text-cyan-700">View All →</Link>
          </div>
          <div className="space-y-3">
            {allAlerts.map((a, idx) => (
              <motion.div key={a._id || idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}
                className={`flex items-start gap-3 rounded-xl p-3 border ${a.severity === 'high' ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
                <div className={`h-9 w-9 rounded-xl grid place-items-center shrink-0 ${a.severity === 'high' ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-500'}`}>
                  <CircleAlert size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-700">{a.disease || 'Alert'}</p>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${a.severity === 'high' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>
                      {a.severity === 'high' ? 'HIGH' : 'MED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{a.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> {a.region}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Health Tips */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 mb-5">
            <Lightbulb size={16} className="text-amber-500" /> AI Health Tips
          </h3>
          <div className="space-y-3">
            {healthTips.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <motion.div key={tip.text} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${tip.bg}`}>
                    <Icon size={18} className={tip.color} />
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-snug">{tip.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 font-display mb-5">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div key={action.label} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                  <Link to={action.to}
                    className={`group flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 p-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 bg-white/80`}>
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${action.from} ${action.to_} grid place-items-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 ${action.shadow}`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <p className="text-xs font-bold text-slate-700 text-center font-display leading-tight">{action.label}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Emergency SOS Floating Button ── */}
      <div className="fixed bottom-6 right-6 z-30 md:bottom-8 md:right-8">
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8, type: 'spring', stiffness: 250 }}>
          <Link to="/patient/nearby"
            className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-red-600 text-white px-5 py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all font-bold text-sm font-display group">
            <Phone size={16} className="group-hover:animate-bounce" />Emergency Help
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
