import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, AlertTriangle, Brain, ShieldCheck, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const PIE_COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6'];

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(Number(value || 0));
}

function riskClass(level) {
  if (level === 'high') return 'bg-red-100 text-red-700 border-red-200';
  if (level === 'medium') return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-green-100 text-green-700 border-green-200';
}

function toDailySeries(trends = []) {
  if (!trends.length) return [];
  const sorted = [...trends].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.slice(-45).map((point, index) => {
    if (index === 0) {
      return {
        date: point.date.slice(5),
        totalCases: point.cases,
        newCases: 0,
      };
    }

    const previous = sorted.slice(-45)[index - 1];
    return {
      date: point.date.slice(5),
      totalCases: point.cases,
      newCases: Math.max(0, point.cases - previous.cases),
    };
  });
}

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [regions, setRegions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [trendPayload, setTrendPayload] = useState(null);

  const loadDashboard = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const [statsRes, regionsRes, alertsRes, trendsRes] = await Promise.all([
        api.get('/api/stats'),
        api.get('/api/regions'),
        api.get('/api/alerts'),
        api.get('/api/trends'),
      ]);

      setStats(statsRes.data);
      setRegions(regionsRes.data.regions || []);
      setAlerts(alertsRes.data.alerts || []);
      setTrendPayload(trendsRes.data);
    } catch (_error) {
      toast.error('Unable to load surveillance dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(() => loadDashboard({ silent: true }), 45000);
    return () => clearInterval(interval);
  }, []);

  const timeSeries = useMemo(() => toDailySeries(trendPayload?.trends || []), [trendPayload]);
  const highRegions = useMemo(() => regions.filter((region) => region.riskLevel === 'high'), [regions]);

  const kpis = useMemo(() => {
    if (!stats) return [];

    return [
      { label: 'Total Cases', value: formatNumber(stats.totalCases), icon: Activity, accent: 'text-blue-600' },
      { label: 'Active Cases', value: formatNumber(stats.activeCases), icon: TrendingUp, accent: 'text-orange-600' },
      { label: 'Critical Alerts', value: formatNumber(stats.criticalAlerts), icon: AlertTriangle, accent: 'text-red-600' },
      { label: 'Recovery Rate', value: `${stats.recoveryRate}%`, icon: ShieldCheck, accent: 'text-green-600' },
      { label: 'AI Confidence Score', value: `${stats.aiConfidenceScore}%`, icon: Brain, accent: 'text-purple-600' },
    ];
  }, [stats]);

  if (loading || !stats || !trendPayload) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">AI Health Surveillance Dashboard</p>
            <h1 className="text-2xl font-bold text-slate-900">India Disease Intelligence Overview</h1>
            <p className="mt-1 text-sm text-slate-600">Integrated real-time datasets from Indian Government Open Data Platform, IDSP, WHO GHO, and disease.sh.</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <p><span className="font-semibold">Last Updated:</span> {new Date(stats.lastUpdated).toLocaleString()}</p>
            <p><span className="font-semibold">Data Source:</span> {stats.dataSource}</p>
            <p><span className="font-semibold">Auto Refresh:</span> Every 45 seconds</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi, index) => (
          <motion.article
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
              <kpi.icon className={kpi.accent} size={18} />
            </div>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{kpi.value}</p>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
          <h3 className="mb-3 text-base font-semibold text-slate-900">Cases Over Time (Last 45 observations)</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={timeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="newCases" name="New Cases" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="totalCases" name="Total Cases" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-base font-semibold text-slate-900">Disease Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={trendPayload.diseaseDistribution || []} dataKey="cases" nameKey="disease" outerRadius={110} label>
                  {(trendPayload.diseaseDistribution || []).map((item, idx) => (
                    <Cell key={item.disease} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-base font-semibold text-slate-900">Age Group Risk Index</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={trendPayload.ageRisk || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="ageGroup" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="riskIndex" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Region Risk Heatmap</h3>
            <p className="text-xs text-slate-500">Red = High risk, Orange = Medium, Green = Safe</p>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {regions.slice(0, 12).map((region) => (
              <div key={region.region} className={`rounded-xl border p-3 ${riskClass(region.riskLevel)}`}>
                <p className="text-sm font-semibold">{region.region}</p>
                <p className="text-xs">Active: {formatNumber(region.activeCases)}</p>
                <p className="text-xs">Total: {formatNumber(region.totalCases)}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-3">
          <h3 className="mb-3 text-base font-semibold text-slate-900">Live Outbreak Alerts (IDSP)</h3>
          <div className="max-h-72 space-y-2 overflow-auto pr-1">
            {alerts.length ? alerts.map((alert, idx) => (
              <div key={`${alert.disease}-${idx}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{alert.disease} · {alert.region}</p>
                  <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${riskClass(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{new Date(alert.timestamp).toLocaleString()} · Source: {alert.source}</p>
              </div>
            )) : <p className="text-sm text-slate-600">No active alerts from upstream sources at this time.</p>}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
          <h3 className="mb-3 text-base font-semibold text-slate-900">AI Insights</h3>
          <div className="space-y-3">
            {(trendPayload.insights || []).map((insight, idx) => (
              <div key={`${insight.type}-${idx}`} className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                <p className="text-sm text-slate-800">{insight.message}</p>
                <p className="mt-1 text-xs font-semibold text-blue-700">Confidence: {insight.confidence}%</p>
              </div>
            ))}
            {!trendPayload.insights?.length && (
              <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">No statistically significant anomalies detected in the latest run.</p>
            )}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">High Risk Regions: {highRegions.length}</p>
              <p>WHO indicators analyzed: {trendPayload.who?.totalIndicatorsScanned || 0}</p>
              <p>Government records loaded: {trendPayload.dataGov?.records?.length || 0}</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-28 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200 xl:col-span-2" />
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
      </div>
      <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
}
