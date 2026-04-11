import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BellRing, BrainCircuit, FileText, MapPinned, RefreshCcw, Siren, UserRound, Waves, Shield, TrendingUp } from 'lucide-react';
import api from '../services/api';

function asChartRows(predictions = []) {
  return predictions.slice(0, 8).map((item, idx) => ({
    day: `D+${idx + 1}`, region: item.region, projected: item.predictedActiveCases7d,
    lower: item.uncertaintyRange?.lower ?? 0, upper: item.uncertaintyRange?.upper ?? 0,
  }));
}

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>{children}</div>
);

export default function AIEngine() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [regions, setRegions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [trends, setTrends] = useState({ trendComparison: [] });
  const [personalRisk, setPersonalRisk] = useState(null);
  const [reportText, setReportText] = useState('');
  const [reportAnalysis, setReportAnalysis] = useState(null);

  useEffect(() => {
    let alive = true;
    const fetchAll = async () => {
      try {
        if (alive) { setError(''); setLoading(true); }
        const [dashboardRes, regionsRes, alertsRes, predictionsRes, trendRes, personalRiskRes] = await Promise.all([
          api.get('/api/dashboard'), api.get('/api/regions'), api.get('/api/alerts'),
          api.get('/api/predictions'), api.get('/api/trends'), api.get('/api/personal-risk'),
        ]);
        if (!alive) return;
        setDashboard(dashboardRes.data); setRegions(regionsRes.data?.regions || []);
        setAlerts(alertsRes.data?.alerts || []); setPredictions(predictionsRes.data?.predictions || []);
        setTrends(trendRes.data || { trendComparison: [] }); setPersonalRisk(personalRiskRes.data || null);
      } catch (err) { if (!alive) return; setError(err?.response?.data?.message || err.message || 'Failed to load AI data'); }
      finally { if (alive) setLoading(false); }
    };
    fetchAll();
    const poll = setInterval(fetchAll, 30000);
    return () => { alive = false; clearInterval(poll); };
  }, []);

  const forecastRows = useMemo(() => asChartRows(predictions), [predictions]);
  const riskHotspots = useMemo(() => regions.slice(0, 6), [regions]);

  const analyzeReport = async () => {
    try { const { data } = await api.post('/api/reports/analyze', { reportText }); setReportAnalysis(data); }
    catch (err) { setReportAnalysis({ riskLevel: 'Unknown', findings: [err?.response?.data?.message || 'Analysis failed'] }); }
  };

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white grid place-items-center shadow-lg"><BrainCircuit size={22} /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">AI Intelligence Hub</h1>
            <p className="text-sm text-slate-500">Forecast, map risk, alerts, reports, and personalized insights</p>
          </div>
        </div>
        <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><RefreshCcw size={12} /> Live refresh 30s</span>
      </motion.div>

      {error && <Card className="p-4 text-rose-600 text-sm border-rose-100">{error}</Card>}

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        {[
          { label: '7-14 day model', val: `${dashboard?.aiConfidence ?? '--'}%`, color: 'text-cyan-600' },
          { label: 'Smart alerts', val: alerts.length, color: 'text-amber-600' },
          { label: 'High-risk regions', val: dashboard?.highRiskRegions ?? '--', color: 'text-rose-600' },
          { label: 'Data sources', val: (dashboard?.dataSources || []).length, color: 'text-violet-600' },
          { label: 'Personal risk', val: `${personalRisk?.score ?? '--'}%`, color: 'text-emerald-600' },
        ].map((m) => (
          <Card key={m.label} className="p-4"><p className="text-xs text-slate-500">{m.label}</p><p className={`text-2xl font-bold ${m.color}`}>{m.val}</p></Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Waves size={16} className="text-cyan-500" /> Trend + Forecast Graph</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={forecastRows}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Line dataKey="projected" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line dataKey="lower" stroke="#22c55e" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                <Line dataKey="upper" stroke="#ef4444" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><MapPinned size={16} className="text-violet-500" /> Risk Map Feed</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={riskHotspots.map((r, i) => ({ slot: i + 1, risk: r.riskScore, active: r.activeCases }))}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="slot" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Area dataKey="risk" stroke="#8b5cf6" fill="#ede9fe" strokeWidth={2} />
                <Area dataKey="active" stroke="#06b6d4" fill="#cffafe" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Siren size={16} className="text-rose-500" /> Smart Alerts</h3>
          <ul className="space-y-2 text-sm max-h-48 overflow-y-auto">
            {alerts.slice(0, 5).map((alert, index) => (
              <li key={`${alert.region}-${index}`} className="rounded-xl bg-slate-50 p-3 border border-slate-100 flex items-center justify-between">
                <span><span className="font-semibold text-slate-800">{alert.region}</span> <span className="text-slate-500">· {alert.disease}</span></span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${(alert.severity || '').toLowerCase() === 'high' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>{alert.severity}</span>
              </li>
            ))}
            {!alerts.length && !loading ? <li className="text-slate-500">No active alerts.</li> : null}
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><BrainCircuit size={16} className="text-cyan-500" /> AI Insights</h3>
          <ul className="space-y-2 text-sm">
            {(dashboard?.insights || []).slice(0, 4).map((insight, index) => (
              <li key={`${insight.type}-${index}`} className="rounded-xl bg-cyan-50 p-3 border border-cyan-100 text-slate-700">{insight.message}</li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><BellRing size={16} className="text-amber-500" /> Multi-source Integration</h3>
          <p className="text-sm text-slate-600">Combines weather, disease surveillance, and population pressure indicators.</p>
          <p className="text-xs text-slate-500 mt-2">Sources: {(dashboard?.dataSources || []).join(', ') || 'loading...'}</p>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><FileText size={16} className="text-cyan-500" /> Report Analysis</h3>
          <textarea value={reportText} onChange={(e) => setReportText(e.target.value)} className="input-field" rows={3} placeholder="Paste report text for quick AI summary..." />
          <button type="button" onClick={analyzeReport} className="btn-primary mt-2 text-xs">Analyze</button>
          {reportAnalysis && <p className="text-xs text-slate-700 mt-2">Risk: {reportAnalysis.riskLevel} · {(reportAnalysis.findings || []).join(' ')}</p>}
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><UserRound size={16} className="text-emerald-500" /> Personalized Risk</h3>
          <p className="text-sm text-slate-700">Risk: <span className="font-bold">{personalRisk?.riskLevel || 'Unknown'}</span></p>
          <p className="text-xs text-slate-500 mt-2">{personalRisk?.reason || 'Submit symptoms to generate a personal risk score.'}</p>
        </Card>
      </div>
    </div>
  );
}
