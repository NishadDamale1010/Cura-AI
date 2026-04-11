import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Thermometer, Heart, Wind, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const symptomList = ['Fever', 'Cough', 'Fatigue', 'Headache', 'Breathing Issues', 'Body Pain'];
const toOptionalNumber = (value) => {
  if (value === '' || value == null) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

export default function SymptomSubmit() {
  const [form, setForm] = useState({
    name: '', age: '', gender: 'Male', city: '', area: '', pincode: '',
    bodyTemperature: '', spo2: '', heartRate: '', durationDays: '', medicalReportUrl: '', region: '',
  });
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const toggleSymptom = (name) => {
    setSymptoms((prev) => {
      const exists = prev.find((s) => s.name === name);
      if (exists) return prev.filter((s) => s.name !== name);
      return [...prev, { name, severity: name === 'Fever' ? 'Low' : 'Moderate' }];
    });
  };

  const setSeverity = (name, severity) => {
    setSymptoms((prev) => prev.map((s) => (s.name === name ? { ...s, severity } : s)));
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      personalDetails: {
        name: form.name,
        age: toOptionalNumber(form.age),
        gender: form.gender,
        city: form.city,
        area: form.area,
        pincode: form.pincode,
      },
      location: { city: form.city, area: form.area, pincode: form.pincode, region: form.region || form.city },
      symptoms,
      vitals: {
        bodyTemperature: toOptionalNumber(form.bodyTemperature),
        spo2: toOptionalNumber(form.spo2),
        heartRate: toOptionalNumber(form.heartRate),
      },
      durationDays: toOptionalNumber(form.durationDays) ?? 0,
      medicalReportUrl: form.medicalReportUrl,
    };
    try {
      const { data } = await api.post('/api/data/add', payload);
      setResult(data);
      setError('');
      toast.success(`Record submitted! AI Risk: ${data.risk || 'Calculated'}`);
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      const normalized = Array.isArray(backendErrors) ? ` (${backendErrors.join(', ')})` : '';
      setError((err.userMessage || err.response?.data?.message || 'Failed to submit record') + normalized);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white grid place-items-center shadow-lg">
          <PlusCircle size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Symptom Logger</h1>
          <p className="text-sm text-slate-500">Record your symptoms and vitals for AI analysis</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="p-6">
          <form onSubmit={submit} className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-cyan-50 text-cyan-600 grid place-items-center text-xs font-bold">1</span>
                Personal Details
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="input-field" placeholder="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
                <select className="input-field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option>Male</option><option>Female</option><option>Other</option></select>
                <input className="input-field" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                <input className="input-field" placeholder="Area" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
                <input className="input-field" placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-amber-50 text-amber-600 grid place-items-center text-xs font-bold">2</span>
                Symptoms
              </p>
              <div className="flex flex-wrap gap-2">
                {symptomList.map((s) => {
                  const selected = symptoms.find((x) => x.name === s);
                  return (
                    <div key={s} className={`flex items-center gap-2 rounded-xl border-2 px-3.5 py-2 transition-all duration-200 ${selected ? 'border-cyan-400 bg-cyan-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                      <button type="button" className={`text-sm ${selected ? 'font-semibold text-cyan-700' : 'text-slate-600'}`} onClick={() => toggleSymptom(s)}>{s}</button>
                      {selected && (
                        <select className="text-xs input-field py-1 px-2" value={selected.severity} onChange={(e) => setSeverity(s, e.target.value)}>
                          <option>Low</option><option>High</option><option>Mild</option><option>Moderate</option><option>Severe</option>
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-rose-50 text-rose-600 grid place-items-center text-xs font-bold">3</span>
                Vitals
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="relative">
                  <Thermometer size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" />
                  <input className="input-field pl-9" placeholder="Body Temperature" value={form.bodyTemperature} onChange={(e) => setForm({ ...form, bodyTemperature: e.target.value })} />
                </div>
                <div className="relative">
                  <Wind size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                  <input className="input-field pl-9" placeholder="SpO2" value={form.spo2} onChange={(e) => setForm({ ...form, spo2: e.target.value })} />
                </div>
                <div className="relative">
                  <Heart size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input className="input-field pl-9" placeholder="Heart Rate" value={form.heartRate} onChange={(e) => setForm({ ...form, heartRate: e.target.value })} />
                </div>
                <input className="input-field" placeholder="Duration (days)" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })} />
                <input className="input-field md:col-span-2" placeholder="Medical report URL (optional)" value={form.medicalReportUrl} onChange={(e) => setForm({ ...form, medicalReportUrl: e.target.value })} />
              </div>
            </div>

            <button className="btn-primary"><Send size={16} /> Submit & Predict</button>
          </form>
        </Card>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100">
          <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-600">{error}</p>
        </motion.div>
      )}
      {result && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
          <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-800">AI Risk: {result.risk} ({result.probability})</p>
            <p className="text-sm text-emerald-700 mt-1">{result.explanation}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
