import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Thermometer, Wind, Activity, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>{children}</div>
);

export default function VitalsPage() {
  const [logs, setLogs] = useState([
    { temp: '98.6', spo2: '98', hr: '75', time: '10:11 AM' },
    { temp: '99.1', spo2: '97', hr: '80', time: '2:30 PM' },
    { temp: '98.4', spo2: '99', hr: '72', time: '6:00 PM' },
  ]);
  const [form, setForm] = useState({ temp: '', spo2: '', hr: '' });

  const add = (e) => {
    e.preventDefault();
    setLogs([{ ...form, time: new Date().toLocaleTimeString() }, ...logs]);
    setForm({ temp: '', spo2: '', hr: '' });
  };

  const chartData = logs.slice().reverse().map((l, i) => ({
    time: l.time,
    temp: parseFloat(l.temp) || 0,
    spo2: parseFloat(l.spo2) || 0,
    hr: parseFloat(l.hr) || 0,
  }));

  return (
    <div className="space-y-5 max-w-[1200px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white grid place-items-center shadow-lg">
          <HeartPulse size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Vital Signs Log</h1>
          <p className="text-sm text-slate-500">Track your vitals over time with visual trends</p>
        </div>
      </motion.div>

      {/* Input Form */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="p-5">
          <form onSubmit={add} className="grid md:grid-cols-4 gap-3">
            <div className="relative">
              <Thermometer size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" />
              <input className="input-field pl-9" placeholder="Temp F" value={form.temp} onChange={(e) => setForm({ ...form, temp: e.target.value })} />
            </div>
            <div className="relative">
              <Wind size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
              <input className="input-field pl-9" placeholder="SpO2 %" value={form.spo2} onChange={(e) => setForm({ ...form, spo2: e.target.value })} />
            </div>
            <div className="relative">
              <Activity size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input className="input-field pl-9" placeholder="HR bpm" value={form.hr} onChange={(e) => setForm({ ...form, hr: e.target.value })} />
            </div>
            <button className="btn-primary"><Plus size={16} /> Log Vitals</button>
          </form>
        </Card>
      </motion.div>

      {/* Chart */}
      {chartData.length > 1 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Vitals Trend</h3>
            <div className="h-52">
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="temp" name="Temp" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="spo2" name="SpO2" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="hr" name="HR" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Log History */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Recent Logs</h3>
          <div className="space-y-2">
            {logs.map((l, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-sm hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-1.5 text-rose-600"><Thermometer size={14} /><span className="font-medium">{l.temp}F</span></div>
                <div className="flex items-center gap-1.5 text-blue-600"><Wind size={14} /><span className="font-medium">{l.spo2}%</span></div>
                <div className="flex items-center gap-1.5 text-emerald-600"><Activity size={14} /><span className="font-medium">{l.hr} bpm</span></div>
                <span className="ml-auto text-xs text-slate-400">{l.time}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
