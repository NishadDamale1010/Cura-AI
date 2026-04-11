import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, BellRing, BrainCircuit, Database, FileUp, MapPinned, ShieldCheck, Sparkles, UploadCloud } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import api from '../services/api';

const features = [
  { title: 'AI Report Analysis', desc: 'Upload PDF/image reports and extract health risks instantly.', icon: FileUp },
  { title: 'Disease Prediction Engine', desc: 'Predict outbreak probabilities before they escalate.', icon: BrainCircuit },
  { title: 'Real-Time Alerts', desc: 'Get notified early when risk spikes in your area.', icon: BellRing },
  { title: 'Health Heatmap', desc: 'Visualize disease spread with region-aware intensity maps.', icon: MapPinned },
  { title: 'Smart Recommendations', desc: 'Receive personalized next-step health suggestions.', icon: ShieldCheck },
  { title: 'Multi-source Integration', desc: 'Merge health + environment + regional intelligence.', icon: Database },
];

const trendData = [
  { day: 'Mon', risk: 42, baseline: 32 },
  { day: 'Tue', risk: 48, baseline: 35 },
  { day: 'Wed', risk: 54, baseline: 37 },
  { day: 'Thu', risk: 61, baseline: 40 },
  { day: 'Fri', risk: 57, baseline: 42 },
  { day: 'Sat', risk: 51, baseline: 39 },
  { day: 'Sun', risk: 46, baseline: 36 },
];

const mockDashboard = [
  { zone: 'Zone A', intensity: 78, alerts: 4 },
  { zone: 'Zone B', intensity: 59, alerts: 3 },
  { zone: 'Zone C', intensity: 44, alerts: 2 },
  { zone: 'Zone D', intensity: 31, alerts: 1 },
];

export default function LandingPage() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const riskColor = useMemo(() => {
    const score = analysis?.risk_score || 0;
    if (score >= 70) return 'text-rose-600';
    if (score >= 45) return 'text-amber-600';
    return 'text-emerald-600';
  }, [analysis]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setFile(e.dataTransfer.files?.[0] || null);
  };

  const analyze = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/analyze-report', {
        file_name: file?.name || 'sample-report.pdf',
      });
      setAnalysis(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 text-slate-800 min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-xl">Cura <span className="text-emerald-600">AI</span></div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#features">Features</a>
            <a href="#analysis">Report AI</a>
            <a href="#impact">Impact</a>
            <Link to="/login" className="px-4 py-2 rounded-xl bg-slate-900 text-white">Get Started</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700"><Sparkles size={13} /> AI-Powered Public Health Platform</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Predict. Prevent. Protect Public Health with AI</h1>
          <p className="mt-4 text-slate-600 text-lg">Upload your medical reports and get instant AI-powered health insights, disease risk predictions, and early warnings.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#analysis" className="px-5 py-3 rounded-xl bg-emerald-600 text-white shadow-sm hover:shadow-md">Analyze My Report</a>
            <a href="#demo" className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50">View Live Dashboard</a>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h3 className="text-sm font-semibold mb-3">AI Monitoring Preview</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line dataKey="risk" stroke="#10b981" strokeWidth={2.5} /><Line dataKey="baseline" stroke="#94a3b8" strokeDasharray="5 4" /></LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <motion.div key={f.title} whileHover={{ y: -4 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <f.icon className="text-emerald-600" size={18} />
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-4">How it Works</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {['Upload Report', 'AI Processes Data', 'Get Insights & Predictions'].map((s, i) => (
            <div key={s} className="rounded-2xl bg-white border border-slate-200 p-5"><p className="text-xs text-emerald-600 font-semibold">Step {i + 1}</p><p className="mt-2 font-medium">{s}</p></div>
          ))}
        </div>
      </section>

      <section id="analysis" className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold mb-3">AI Report Analysis</h3>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`rounded-2xl border-2 border-dashed p-8 text-center ${dragging ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}
          >
            <UploadCloud className="mx-auto text-emerald-600" />
            <p className="mt-2 text-sm">Drag & Drop PDF / JPG / PNG</p>
            <input type="file" className="mt-3" accept=".pdf,image/png,image/jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <button onClick={analyze} className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white">Upload & Analyze</button>
          {loading && <p className="mt-2 text-sm text-slate-500">Analyzing report with AI...</p>}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold mb-3">AI Output Preview</h3>
          <div className="text-sm space-y-1">
            <p><b>Patient Name:</b> {analysis?.patient_name || 'John Doe'}</p>
            <p><b>Age:</b> {analysis?.age || 45}</p>
            <p><b>Blood Pressure:</b> {analysis?.metrics?.blood_pressure || '150/95'}</p>
            <p><b>Glucose:</b> {analysis?.metrics?.glucose || 180}</p>
            <p className={riskColor}><b>Risk Score:</b> {analysis?.risk_score || 72}%</p>
            <p><b>Condition:</b> {(analysis?.conditions || ['Hypertension Risk']).join(', ')}</p>
          </div>
          <div className="h-40 mt-3">
            <ResponsiveContainer>
              <AreaChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Area dataKey="risk" stroke="#ef4444" fill="#fecaca" /></AreaChart>
            </ResponsiveContainer>
          </div>
          <ul className="text-sm mt-2 list-disc pl-5 text-slate-600">
            {(analysis?.recommendations || ['Reduce salt intake', 'Exercise regularly', 'Consult a physician']).map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>
      </section>

      <section id="demo" className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-4">Live Demo Preview</h2>
        <div className="rounded-2xl bg-white border border-slate-200 p-5 h-64">
          <ResponsiveContainer>
            <AreaChart data={mockDashboard}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" /><YAxis /><Tooltip /><Area dataKey="intensity" stroke="#6366f1" fill="#c7d2fe" /></AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section id="impact" className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-4">
        {['10,000+ Reports Analyzed', '95% Accuracy', 'Real-time monitoring across regions'].map((s) => (
          <div key={s} className="rounded-2xl border border-slate-200 bg-white p-6 text-center font-semibold">{s}</div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 text-white p-10 text-center">
          <h2 className="text-3xl font-semibold">Start Using AI for Smarter Healthcare Today</h2>
          <Link to="/register" className="inline-block mt-4 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold">Get Started</Link>
        </div>
      </section>

      <a href="#analysis" className="fixed bottom-6 right-6 z-30 rounded-full bg-emerald-600 text-white p-4 shadow-lg">
        <UploadCloud size={20} />
      </a>
    </div>
  );
}
