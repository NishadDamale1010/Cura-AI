import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bell, Shield, Clock, Search, Filter } from 'lucide-react';
import api from '../services/api';

function severityStyle(level) {
  const s = (level || 'medium').toLowerCase();
  if (s === 'high' || s === 'critical') return 'border-rose-100 bg-rose-50/50';
  if (s === 'medium') return 'border-amber-100 bg-amber-50/50';
  return 'border-emerald-100 bg-emerald-50/50';
}

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>{children}</div>
);

export default function DoctorAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/api/alerts').then((r) => {
      const payload = Array.isArray(r.data) ? r.data : r.data?.alerts || [];
      setAlerts(payload);
    });
  }, []);

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => (a.severity || a.risk || '').toLowerCase() === filter);

  return (
    <div className="space-y-5 max-w-[1200px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white grid place-items-center shadow-lg">
            <Bell size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Alert Center</h1>
            <p className="text-sm text-slate-500">{alerts.length} active alert{alerts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all capitalize ${filter === f ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-rose-600">{alerts.filter((a) => ['high', 'critical'].includes((a.severity || a.risk || '').toLowerCase())).length}</p>
          <p className="text-xs text-slate-500">Critical</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{alerts.filter((a) => (a.severity || a.risk || '').toLowerCase() === 'medium').length}</p>
          <p className="text-xs text-slate-500">Medium</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{alerts.filter((a) => (a.severity || a.risk || '').toLowerCase() === 'low').length}</p>
          <p className="text-xs text-slate-500">Low</p>
        </Card>
      </div>

      <div className="space-y-3">
        {filtered.map((a, idx) => (
          <motion.div key={`${a.region || a.location}-${idx}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
            className={`rounded-2xl border p-4 transition-all duration-200 hover:shadow-md ${severityStyle(a.severity || a.risk)}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-xl grid place-items-center shrink-0 ${['high', 'critical'].includes((a.severity || a.risk || '').toLowerCase()) ? 'bg-rose-100 text-rose-500' : (a.severity || a.risk || '').toLowerCase() === 'medium' ? 'bg-amber-100 text-amber-500' : 'bg-emerald-100 text-emerald-500'}`}>
                  {['high', 'critical'].includes((a.severity || a.risk || '').toLowerCase()) ? <Shield size={16} /> : <AlertTriangle size={16} />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{a.region || a.location || 'Unknown region'}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{a.message || `${a.disease || 'Outbreak signal'} reported by ${a.source || 'surveillance network'}.`}</p>
                  {a.timestamp && <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock size={10} />{new Date(a.timestamp).toLocaleString()}</p>}
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${['high', 'critical'].includes((a.severity || a.risk || '').toLowerCase()) ? 'bg-rose-500 text-white' : (a.severity || a.risk || '').toLowerCase() === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {a.severity || a.risk || 'medium'}
              </span>
            </div>
          </motion.div>
        ))}
        {!filtered.length && (
          <Card className="p-10 text-center">
            <Bell size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-slate-500">No active alerts at the moment.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
