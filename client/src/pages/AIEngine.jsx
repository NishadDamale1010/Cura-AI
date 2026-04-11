import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BellRing, BrainCircuit, FileText, MapPinned, RefreshCcw, Siren, UserRound, Waves } from 'lucide-react';
import api from '../services/api';

function asChartRows(predictions = []) {
  return predictions.slice(0, 8).map((item, idx) => ({
    day: `D+${idx + 1}`,
    region: item.region,
    disease: item.disease || 'Unknown',
    projected: item.predictedActiveCases7d,
    lower: item.uncertaintyRange?.lower ?? 0,
    upper: item.uncertaintyRange?.upper ?? 0,
  }));
}

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
        if (alive) {
          setError('');
          setLoading(true);
        }

        const [dashboardRes, regionsRes, alertsRes, predictionsRes, trendRes, personalRiskRes] = await Promise.all([
          api.get('/api/dashboard'),
          api.get('/api/regions'),
          api.get('/api/alerts'),
          api.get('/api/predictions'),
          api.get('/api/trends'),
          api.get('/api/personal-risk'),
        ]);

        if (!alive) return;
        setDashboard(dashboardRes.data);
        setRegions(regionsRes.data?.regions || []);
        setAlerts(alertsRes.data?.alerts || []);
        setPredictions(predictionsRes.data?.predictions || []);
        setTrends(trendRes.data || { trendComparison: [] });
        setPersonalRisk(personalRiskRes.data || null);
      } catch (err) {
        if (!alive) return;
        setError(err?.response?.data?.message || err.message || 'Failed to load AI intelligence data');
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchAll();
    const poll = setInterval(fetchAll, 30000);

    return () => {
      alive = false;
      clearInterval(poll);
    };
  }, []);

  const forecastRows = useMemo(() => asChartRows(predictions), [predictions]);
  const riskHotspots = useMemo(() => regions.slice(0, 6), [regions]);
  const diseaseLabels = useMemo(() => {
    const counts = {};
    predictions.forEach((p) => {
      const key = p.disease || 'Unknown';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [predictions]);
  const analyzeReport = async () => {
    try {
      const { data } = await api.post('/api/reports/analyze', { reportText });
      setReportAnalysis(data);
    } catch (err) {
      setReportAnalysis({ riskLevel: 'Unknown', findings: [err?.response?.data?.message || 'Analysis failed'] });
    }
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 grid place-items-center">
            <BrainCircuit size={20} className="text-white" />
          </div>
          <div>
            <h2 className="section-title">AI Intelligence Hub</h2>
            <p className="text-sm text-slate-500">Forecast, map risk, alerts, reports, and personalized insights in one screen</p>
          </div>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <RefreshCcw size={14} /> live refresh every 30s
        </div>
      </motion.div>

      {error ? <div className="card p-4 text-red-600 text-sm">{error}</div> : null}

      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="metric-card"><p className="text-xs text-slate-500">7–14 day trend model</p><p className="text-xl font-bold">{dashboard?.aiConfidence ?? '--'}%</p></div>
        <div className="metric-card"><p className="text-xs text-slate-500">Smart alerts</p><p className="text-xl font-bold">{alerts.length}</p></div>
        <div className="metric-card"><p className="text-xs text-slate-500">High-risk regions</p><p className="text-xl font-bold">{dashboard?.highRiskRegions ?? '--'}</p></div>
        <div className="metric-card"><p className="text-xs text-slate-500">Data sources fused</p><p className="text-xl font-bold">{(dashboard?.dataSources || []).length}</p></div>
        <div className="metric-card"><p className="text-xs text-slate-500">Personalized risk</p><p className="text-xl font-bold">{personalRisk?.score ?? '--'}%</p></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-5 h-80">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Waves size={16} /> Trend + Forecast Graph</h3>
          <div className="mb-2 flex flex-wrap gap-2">
            {diseaseLabels.map((item) => (
              <span key={item.name} className="text-[11px] rounded-full bg-emerald-50 border border-emerald-100 px-2 py-1 text-emerald-700">
                {item.name}: {item.count}
              </span>
            ))}
            {!diseaseLabels.length && <span className="text-[11px] text-slate-500">No disease labels yet</span>}
          </div>
          <ResponsiveContainer>
            <LineChart data={forecastRows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip formatter={(value, _name, context) => [value, context?.payload?.disease || 'Predicted']} />
              <Line dataKey="projected" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line dataKey="lower" stroke="#10b981" strokeWidth={1.5} dot={false} />
              <Line dataKey="upper" stroke="#ef4444" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-5 h-80">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><MapPinned size={16} /> Interactive Risk Map Feed</h3>
          <ResponsiveContainer>
            <AreaChart data={riskHotspots.map((r, i) => ({ slot: i + 1, risk: r.riskScore, active: r.activeCases }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="slot" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area dataKey="risk" stroke="#6366f1" fill="#c7d2fe" strokeWidth={2} />
              <Area dataKey="active" stroke="#ec4899" fill="#fbcfe8" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Siren size={16} /> Smart Alerts + Real-time Updates</h3>
          <ul className="space-y-2 text-sm text-slate-700 max-h-48 overflow-y-auto">
            {alerts.slice(0, 5).map((alert, index) => (
              <li key={`${alert.region}-${index}`} className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                <span className="font-semibold">{alert.region}</span> · {alert.disease} · {alert.severity}
              </li>
            ))}
            {!alerts.length && !loading ? <li>No active alerts.</li> : null}
          </ul>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><BrainCircuit size={16} /> AI Insight Generator</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {(dashboard?.insights || []).slice(0, 4).map((insight, index) => (
              <li key={`${insight.type}-${index}`} className="rounded-lg bg-emerald-50 p-2 border border-emerald-100">{insight.message}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><BellRing size={16} /> Multi-source Integration</h3>
          <p className="text-sm text-slate-600">Combines weather, disease surveillance, and population pressure indicators through the backend aggregator.</p>
          <p className="text-xs text-slate-500 mt-2">Sources: {(dashboard?.dataSources || []).join(', ') || 'loading…'}</p>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><FileText size={16} /> PDF / Report Analysis</h3>
          <textarea value={reportText} onChange={(e) => setReportText(e.target.value)} className="w-full border rounded-lg p-2 text-sm" rows={4} placeholder="Paste report text for quick AI summary..." />
          <button type="button" onClick={analyzeReport} className="mt-2 rounded-md bg-emerald-600 text-white px-3 py-1.5 text-sm">Analyze report</button>
          <p className="text-xs text-slate-500 mt-2">Latest trend pairs: {(trends?.trendComparison || []).slice(0, 2).map((x) => x.region).join(', ') || 'No trend data yet'}</p>
          {reportAnalysis ? <p className="text-xs text-slate-700 mt-2">Risk: {reportAnalysis.riskLevel} · {(reportAnalysis.findings || []).join(' ')}</p> : null}
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><UserRound size={16} /> Personalized Risk Score</h3>
          <p className="text-sm text-slate-700">Risk level: <span className="font-semibold">{personalRisk?.riskLevel || 'Unknown'}</span></p>
          <p className="text-xs text-slate-500 mt-2">{personalRisk?.reason || 'Submit symptoms to generate a personal risk score.'}</p>
        </div>
      </div>
    </div>
  );
}
