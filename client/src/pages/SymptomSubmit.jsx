import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle, Thermometer, Heart, Wind, Send, CheckCircle2,
  AlertCircle, Loader2, RotateCcw, Activity
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const SYMPTOM_LIST = [
  { name: 'Fever', emoji: '🌡️' },
  { name: 'Cough', emoji: '😮‍💨' },
  { name: 'Fatigue', emoji: '😴' },
  { name: 'Headache', emoji: '🤕' },
  { name: 'Breathing Issues', emoji: '💨' },
  { name: 'Body Pain', emoji: '🩺' },
  { name: 'Sore Throat', emoji: '🔴' },
  { name: 'Nausea', emoji: '🤢' },
  { name: 'Diarrhea', emoji: '🚨' },
  { name: 'Rash', emoji: '🔵' },
];

const INITIAL_FORM = {
  name: '', age: '', gender: 'Male', city: '', area: '', pincode: '',
  bodyTemperature: '', spo2: '', heartRate: '',
  durationDays: '', medicalReportUrl: '', region: '',
};

const toNum = (v) => {
  if (v === '' || v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const RISK_CONFIG = {
  High: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-500' },
  Medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-500' },
  Low: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-500' },
};

export default function SymptomSubmit() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleSymptom = (name) => {
    setSymptoms((prev) => {
      const exists = prev.find((s) => s.name === name);
      if (exists) return prev.filter((s) => s.name !== name);
      return [...prev, { name, severity: 'Moderate' }];
    });
  };

  const setSeverity = (name, severity) =>
    setSymptoms((prev) => prev.map((s) => (s.name === name ? { ...s, severity } : s)));

  const reset = () => {
    setForm(INITIAL_FORM);
    setSymptoms([]);
    setResult(null);
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    // Client-side validation
    if (!form.city.trim()) {
      setError('Please enter your city.');
      toast.error('City is required to submit a record.');
      return;
    }
    if (symptoms.length === 0) {
      setError('Please select at least one symptom.');
      toast.error('Please select at least one symptom.');
      return;
    }

    const payload = {
      personalDetails: {
        name: form.name.trim(),
        age: toNum(form.age),
        gender: form.gender,
        city: form.city.trim(),
        area: form.area.trim(),
        pincode: form.pincode.trim(),
      },
      location: {
        city: form.city.trim(),
        area: form.area.trim(),
        pincode: form.pincode.trim(),
        region: form.region.trim() || form.city.trim(),
      },
      symptoms,
      vitals: {
        bodyTemperature: toNum(form.bodyTemperature),
        spo2: toNum(form.spo2),
        heartRate: toNum(form.heartRate),
      },
      durationDays: toNum(form.durationDays) ?? 0,
      medicalReportUrl: form.medicalReportUrl.trim() || undefined,
    };

    setLoading(true);
    const tid = toast.loading('Analyzing symptoms via AI...');

    try {
      const { data } = await api.post('/api/data/add', payload);
      setResult(data);
      toast.dismiss(tid);
      toast.success(`Record submitted! AI Risk Level: ${data.risk || 'Calculated'}`, { duration: 5000 });
    } catch (err) {
      toast.dismiss(tid);
      const backendMsg = err.response?.data?.message || '';
      const backendErrors = err.response?.data?.errors;
      const normalized = Array.isArray(backendErrors)
        ? ` — Errors: ${backendErrors.join(', ')}`
        : '';
      const message = backendMsg
        ? `${backendMsg}${normalized}`
        : 'Failed to submit record. Please try again.';
      setError(message);
      toast.error(message.slice(0, 100));
    } finally {
      setLoading(false);
    }
  };

  const riskConfig = result?.risk ? RISK_CONFIG[result.risk] || RISK_CONFIG.Low : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white grid place-items-center shadow-glow-cyan">
            <PlusCircle size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-800">Symptom Logger</h1>
            <p className="text-sm text-slate-500">AI-powered clinical risk assessment</p>
          </div>
        </div>
        {result && (
          <button onClick={reset} className="btn-outline text-sm">
            <RotateCcw size={15} /> New Entry
          </button>
        )}
      </motion.div>

      {/* Form Card */}
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <form onSubmit={submit} className="card divide-y divide-slate-100">

              {/* Section 1 - Personal Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-7 w-7 rounded-xl bg-cyan-100 text-cyan-700 grid place-items-center text-xs font-black font-display">1</span>
                  <h2 className="text-sm font-bold text-slate-700 font-display uppercase tracking-wide">Personal Details</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <input className="input-field" placeholder="Full Name *" value={form.name} onChange={(e) => setField('name', e.target.value)} required />
                  <input className="input-field" placeholder="Age *" type="number" min="0" max="150" value={form.age} onChange={(e) => setField('age', e.target.value)} required />
                  <select className="input-field" value={form.gender} onChange={(e) => setField('gender', e.target.value)}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <input className="input-field" placeholder="City *" value={form.city} onChange={(e) => setField('city', e.target.value)} required />
                  <input className="input-field" placeholder="Area / Locality" value={form.area} onChange={(e) => setField('area', e.target.value)} />
                  <input className="input-field" placeholder="Pincode" value={form.pincode} onChange={(e) => setField('pincode', e.target.value)} />
                </div>
              </div>

              {/* Section 2 - Symptoms */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-7 w-7 rounded-xl bg-amber-100 text-amber-700 grid place-items-center text-xs font-black font-display">2</span>
                  <h2 className="text-sm font-bold text-slate-700 font-display uppercase tracking-wide">Select Symptoms
                    <span className="ml-2 badge badge-amber">required</span>
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOM_LIST.map((s) => {
                    const sel = symptoms.find((x) => x.name === s.name);
                    return (
                      <div key={s.name}>
                        <button
                          type="button"
                          onClick={() => toggleSymptom(s.name)}
                          className={`flex items-center gap-2 rounded-xl border-2 px-3.5 py-2 text-sm font-semibold transition-all duration-200
                            ${sel
                              ? 'border-cyan-400 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-soft'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:text-cyan-600'
                            }`}
                        >
                          <span>{s.emoji}</span> {s.name}
                          {sel && <span className="w-4 h-4 rounded-full bg-cyan-500 text-white text-[9px] grid place-items-center">✓</span>}
                        </button>
                        {sel && (
                          <div className="mt-1.5">
                            <select
                              className="text-xs input-field py-1 px-2 w-full"
                              value={sel.severity}
                              onChange={(e) => setSeverity(s.name, e.target.value)}
                            >
                              <option>Low</option>
                              <option>Mild</option>
                              <option>Moderate</option>
                              <option>High</option>
                              <option>Severe</option>
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {symptoms.length > 0 && (
                  <p className="text-xs text-cyan-600 font-semibold">{symptoms.length} symptom(s) selected</p>
                )}
              </div>

              {/* Section 3 - Vitals */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-7 w-7 rounded-xl bg-rose-100 text-rose-700 grid place-items-center text-xs font-black font-display">3</span>
                  <h2 className="text-sm font-bold text-slate-700 font-display uppercase tracking-wide">Vitals & Duration
                    <span className="ml-2 badge badge-green">optional</span>
                  </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="relative">
                    <Thermometer size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none" />
                    <input className="input-field pl-9" placeholder="Body Temp (°C)" type="number" step="0.1" value={form.bodyTemperature} onChange={(e) => setField('bodyTemperature', e.target.value)} />
                  </div>
                  <div className="relative">
                    <Wind size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
                    <input className="input-field pl-9" placeholder="SpO2 (%)" type="number" value={form.spo2} onChange={(e) => setField('spo2', e.target.value)} />
                  </div>
                  <div className="relative">
                    <Heart size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                    <input className="input-field pl-9" placeholder="Heart Rate (BPM)" type="number" value={form.heartRate} onChange={(e) => setField('heartRate', e.target.value)} />
                  </div>
                  <input className="input-field" placeholder="Duration (days)" type="number" value={form.durationDays} onChange={(e) => setField('durationDays', e.target.value)} />
                  <input className="input-field md:col-span-2" placeholder="Medical Report URL (optional)" value={form.medicalReportUrl} onChange={(e) => setField('medicalReportUrl', e.target.value)} />
                </div>
              </div>

              {/* Error Banner */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mx-6 mb-2 flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200">
                    <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-700 font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <div className="p-6">
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Analyzing with AI...</>
                  ) : (
                    <><Activity size={18} /> Submit & Generate AI Risk Score</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          // Result View
          <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className={`card p-6 border-2 ${riskConfig.border} ${riskConfig.bg}`}>
              <div className="flex items-start gap-4">
                <div className={`h-14 w-14 rounded-2xl ${riskConfig.badge} text-white grid place-items-center shadow-lg shrink-0`}>
                  <Activity size={26} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-xl font-bold font-display text-slate-800">AI Risk Assessment</h2>
                    <span className={`badge ${riskConfig.badge} text-white border-0 text-xs`}>{result.risk} Risk</span>
                    {result.qualityScore != null && (
                      <span className="badge badge-green text-xs">Quality: {result.qualityScore}%</span>
                    )}
                  </div>
                  <p className="text-4xl font-black font-display text-slate-800 mb-1">
                    {Math.round((result.probability || 0) * 100)}%
                    <span className="text-base font-normal text-slate-500 ml-2">probability</span>
                  </p>
                  <p className={`text-sm font-medium ${riskConfig.text} mt-3 leading-relaxed`}>{result.explanation}</p>
                </div>
              </div>

              {result.saved === false && (
                <div className="mt-4 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <AlertCircle size={14} />
                  <span>Prediction generated but record not saved (offline mode). Data will sync when connection restores.</span>
                </div>
              )}

              <div className="mt-5 pt-5 border-t border-white/60 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Symptoms</p>
                  <p className="text-2xl font-black font-display text-slate-800">{(result.symptoms || symptoms).length}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">City</p>
                  <p className="text-sm font-bold font-display text-slate-700 truncate">{result.location?.city || form.city}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Risk Level</p>
                  <p className={`text-lg font-black font-display ${riskConfig.text}`}>{result.risk}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="btn-primary flex-1 py-3">
                <PlusCircle size={18} /> Log Another Record
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
