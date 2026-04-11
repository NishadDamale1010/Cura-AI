import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Activity, ShieldCheck, MapPin, TrendingUp, AlertTriangle,
  Droplets, Stethoscope, Upload, Phone, Siren,
  CheckCircle2, CircleAlert, Wind, Building2, Navigation,
  Clock, Lightbulb
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const asArray = (v) => (Array.isArray(v) ? v : []);

const healthTrendData = [
  { date: 'Nov 15', Fever: 38, Cough: 45, Fatigue: 10 },
  { date: 'Nov 16', Fever: 65, Cough: 50, Fatigue: 30 },
  { date: 'Nov 17', Fever: 48, Cough: 55, Fatigue: 50 },
  { date: 'Nov 18', Fever: 40, Cough: 35, Fatigue: 62 },
  { date: 'Nov 19', Fever: 55, Cough: 40, Fatigue: 78 },
  { date: 'Today', Fever: 35, Cough: 50, Fatigue: 45 },
];

const symptomItems = [
  { name: 'Fever', status: 'Mild', days: '2 days', active: true },
  { name: 'Cough', status: 'None', days: '', active: false },
  { name: 'Breathing Issue', status: 'None', days: '', active: false },
  { name: 'Body Pain', status: 'Mild', days: '', active: true },
];

const outbreakZones = [
  { name: 'Pimpri', risk: 'High', top: '22%', left: '30%', color: '#ef4444' },
  { name: 'Hinjewadi', risk: 'Medium', top: '55%', left: '35%', color: '#f59e0b' },
  { name: 'Kharadi', risk: 'Low', top: '30%', left: '75%', color: '#22c55e' },
];

const healthTips = [
  { icon: Droplets, text: 'Drink clean and filtered water', color: 'bg-blue-100 text-blue-600' },
  { icon: ShieldCheck, text: 'Use mosquito repellents', color: 'bg-rose-100 text-rose-600' },
  { icon: Heart, text: 'Maintain hygiene and wash hands', color: 'bg-emerald-100 text-emerald-600' },
  { icon: Wind, text: 'Avoid stagnant water areas', color: 'bg-amber-100 text-amber-600' },
];

const quickActions = [
  { icon: Stethoscope, label: 'Book\nAppointment', to: '/patient/submit', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { icon: Upload, label: 'Upload\nReports', to: '/patient/uploads', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { icon: Phone, label: 'Contact\nDoctor', to: '/messages', color: 'bg-violet-50 text-violet-600 border-violet-100' },
  { icon: Siren, label: 'Emergency\nSOS', to: '/patient/nearby', color: 'bg-rose-50 text-rose-600 border-rose-100' },
];

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
    {children}
  </div>
);

export default function PatientDashboard() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api
      .get('/api/alerts')
      .catch(() => ({ data: [] }))
      .then((a) => {
        const alertPayload = Array.isArray(a.data) ? a.data : a.data?.alerts;
        setAlerts(asArray(alertPayload));
      });
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Patient';

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome, {firstName}</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your real-time health and outbreak insights</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-white rounded-xl border border-slate-100 px-3 py-2 shadow-sm">
          <MapPin size={14} className="text-emerald-500" />
          <span>Pune, Maharashtra</span>
        </div>
      </motion.div>

      {/* 4 Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-500 grid place-items-center">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Current Health Status</p>
              <p className="text-xl font-bold text-emerald-600">Low Risk</p>
              <p className="text-[11px] text-slate-400">All good - Updated 5 min ago</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-violet-50 text-violet-500 grid place-items-center">
              <Activity size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Active Cases in Area</p>
              <p className="text-xl font-bold text-slate-800">12</p>
              <p className="text-[11px] text-slate-400">Last 7 days</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-500 grid place-items-center">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Predicted Risk (Next 7 Days)</p>
              <p className="text-xl font-bold text-amber-500">Medium</p>
              <p className="text-[11px] text-slate-400">
                Dengue <span className="text-rose-500">+20%</span>
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-500 grid place-items-center">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Nearest Clinic</p>
              <p className="text-xl font-bold text-slate-800">2.3 km</p>
              <p className="text-[11px] text-slate-400">Sahyadri Hospital</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Middle Row: Health Trend + Symptom Checker + Outbreak Map */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid lg:grid-cols-[1.4fr_0.8fr_0.8fr] gap-4"
      >
        {/* Health Trend Chart */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Your Health Trend</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              Last 7 Days
            </span>
          </div>
          <div className="h-52">
            <ResponsiveContainer>
              <LineChart data={healthTrendData}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="Fever" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: '#ef4444' }} />
                <Line type="monotone" dataKey="Cough" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6' }} />
                <Line type="monotone" dataKey="Fatigue" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Symptom Checker */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Symptom Checker</h3>
          <div className="space-y-3">
            {symptomItems.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-6 w-6 rounded-full grid place-items-center ${
                      s.active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {s.active ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <div className="h-3 w-3 rounded-full border-2 border-slate-300" />
                    )}
                  </div>
                  <span className="text-sm text-slate-700 font-medium">{s.name}</span>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium ${s.active ? 'text-amber-600' : 'text-slate-400'}`}>
                    {s.status}
                  </span>
                  {s.days && <span className="text-[10px] text-slate-400 ml-1">- {s.days}</span>}
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/patient/submit"
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium py-2.5 rounded-xl hover:shadow-lg transition-all"
          >
            Check Symptoms
          </Link>
        </Card>

        {/* Live Outbreak Map Mini */}
        <Card className="p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800">Live Outbreak Map</h3>
            <Link to="/patient/nearby" className="text-slate-400 hover:text-blue-500 transition-colors">
              <Navigation size={16} />
            </Link>
          </div>
          <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-emerald-50 border border-slate-100">
            {outbreakZones.map((zone) => (
              <div
                key={zone.name}
                className="absolute flex flex-col items-center"
                style={{ top: zone.top, left: zone.left }}
              >
                <span
                  className="h-5 w-5 rounded-full animate-ping absolute"
                  style={{ backgroundColor: zone.color, opacity: 0.3 }}
                />
                <span
                  className="h-5 w-5 rounded-full relative z-10 border-2 border-white shadow-md"
                  style={{ backgroundColor: zone.color }}
                />
                <span className="text-[10px] font-bold mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-sm relative z-10">
                  {zone.name}
                </span>
                <span
                  className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                    zone.risk === 'High'
                      ? 'bg-red-500 text-white'
                      : zone.risk === 'Medium'
                        ? 'bg-amber-500 text-white'
                        : 'bg-green-500 text-white'
                  }`}
                >
                  {zone.risk}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Bottom Row: Alerts + Tips + Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid lg:grid-cols-3 gap-4"
      >
        {/* Recent Alerts */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" /> Recent Alerts
            </h3>
            <Link to="/patient/nearby" className="text-xs text-cyan-500 font-medium hover:text-cyan-600">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {asArray(alerts)
              .slice(0, 3)
              .map((a, idx) => (
                <div
                  key={a._id || `alert-${idx}`}
                  className={`flex items-start gap-3 rounded-xl p-3 ${
                    a.severity === 'high' ? 'bg-rose-50 border border-rose-100' : 'bg-amber-50 border border-amber-100'
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-lg grid place-items-center shrink-0 ${
                      a.severity === 'high' ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-500'
                    }`}
                  >
                    <CircleAlert size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-700">{a.disease || 'Alert'}</p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          a.severity === 'high' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                        }`}
                      >
                        {a.severity === 'high' ? 'High' : 'Medium'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{a.message || 'Cases rising in your area'}</p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock size={10} /> {a.region || '10 min ago'}
                    </p>
                  </div>
                </div>
              ))}
            {!alerts.length && (
              <>
                <div className="flex items-start gap-3 rounded-xl p-3 bg-rose-50 border border-rose-100">
                  <div className="h-8 w-8 rounded-lg grid place-items-center shrink-0 bg-rose-100 text-rose-500">
                    <CircleAlert size={16} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">Dengue Alert</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">High</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Cases rising in your area</p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock size={10} /> 10 min ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl p-3 bg-amber-50 border border-amber-100">
                  <div className="h-8 w-8 rounded-lg grid place-items-center shrink-0 bg-amber-100 text-amber-500">
                    <CircleAlert size={16} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">Flu Warning</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">Medium</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Seasonal flu cases increasing</p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock size={10} /> 2 hrs ago
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Personal Health Tips */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
            <Lightbulb size={16} className="text-amber-500" /> Personal Health Tips
          </h3>
          <div className="space-y-3">
            {healthTips.map((tip) => {
              const TipIcon = tip.icon;
              return (
                <div key={tip.text} className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl grid place-items-center shrink-0 ${tip.color}`}>
                    <TipIcon size={16} />
                  </div>
                  <p className="text-sm text-slate-600">{tip.text}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.to}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 hover:shadow-md transition-all duration-200 ${action.color}`}
                >
                  <div className="h-10 w-10 rounded-xl bg-white grid place-items-center shadow-sm">
                    <ActionIcon size={20} />
                  </div>
                  <p className="text-xs font-medium text-center whitespace-pre-line leading-tight">{action.label}</p>
                </Link>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Emergency Help - Fixed Position */}
      <div className="fixed bottom-6 left-6 z-30 md:left-72">
        <Link
          to="/patient/nearby"
          className="flex items-center gap-2 bg-gradient-to-r from-rose-400 to-rose-500 text-white px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all font-medium text-sm"
        >
          <Phone size={16} /> Emergency Help
        </Link>
      </div>
    </div>
  );
}
