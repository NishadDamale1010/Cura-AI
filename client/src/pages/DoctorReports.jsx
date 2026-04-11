import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, FileText, Database, BookOpen, Search, Save } from 'lucide-react';
import api from '../services/api';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>{children}</div>
);

export default function DoctorReports() {
  const [records, setRecords] = useState([]);
  const [region, setRegion] = useState('');
  const [bulk, setBulk] = useState({ numberOfCases: '', diseaseType: '', region: '' });
  const [monthly, setMonthly] = useState({ month: new Date().toISOString().slice(0, 7), region: '', summary: '', totalCasesReviewed: '', highRiskCount: '', dominantDisease: '', recommendations: '' });
  const [library, setLibrary] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    const [{ data }, reportRes] = await Promise.all([api.get('/api/data/all', { params: { region } }), api.get('/api/reports/mine')]);
    setRecords(data);
    setLibrary(reportRes.data.reports || []);
  };

  useEffect(() => { load().catch(() => setError('Failed to load data')); }, []);

  const saveDiagnosis = async (id, payload) => {
    try { await api.patch(`/api/data/${id}/diagnosis`, payload); setError(''); await load(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to save diagnosis'); }
  };

  const submitBulk = async (e) => {
    e.preventDefault();
    await api.post('/api/data/bulk', { ...bulk, numberOfCases: Number(bulk.numberOfCases) });
    setBulk({ numberOfCases: '', diseaseType: '', region: '' });
    await load();
  };

  const submitMonthly = async (e) => {
    e.preventDefault();
    await api.post('/api/reports/doctor/monthly', {
      ...monthly, totalCasesReviewed: Number(monthly.totalCasesReviewed || 0), highRiskCount: Number(monthly.highRiskCount || 0),
      recommendations: monthly.recommendations.split('\n').map((line) => line.trim()).filter(Boolean),
    });
    setMonthly((m) => ({ ...m, summary: '', totalCasesReviewed: '', highRiskCount: '', dominantDisease: '', recommendations: '' }));
    await load();
  };

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      {error && <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-rose-50 text-rose-600 text-sm border border-rose-100">{error}</motion.div>}

      {/* Case Manager */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-5 overflow-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white grid place-items-center shadow-lg"><ClipboardList size={20} /></div>
            <h2 className="text-xl font-bold text-slate-800">Case Manager</h2>
          </div>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input-field pl-9" placeholder="Filter by region" value={region} onChange={(e) => setRegion(e.target.value)} />
            </div>
            <button onClick={load} className="btn-primary">Apply</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Patient</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Location</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Symptoms + Vitals</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Risk</th>
                  <th className="text-left py-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Diagnosis</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id} className="border-b border-slate-50 align-top hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-2"><p className="font-medium text-slate-800">{r.personalDetails?.name || 'N/A'}</p><p className="text-xs text-slate-500">{r.personalDetails?.age || '-'} / {r.personalDetails?.gender || '-'}</p></td>
                    <td className="py-3 px-2 text-slate-600">{r.location.city}, {r.location.area || r.location.region}</td>
                    <td className="py-3 px-2"><p className="text-slate-700">{r.symptoms.map((s) => `${s.name}(${s.severity})`).join(', ')}</p><p className="text-xs text-slate-500 mt-0.5">Temp {r.vitals?.bodyTemperature || '-'}C | SpO2 {r.vitals?.spo2 || '-'} | HR {r.vitals?.heartRate || '-'}</p></td>
                    <td className="py-3 px-2"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${(r.risk || '').toLowerCase() === 'high' ? 'bg-rose-500 text-white' : (r.risk || '').toLowerCase() === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>{r.risk}</span></td>
                    <td className="py-3 px-2"><DiagnosisEditor record={r} onSave={saveDiagnosis} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Monthly Report */}
        <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={submitMonthly}>
          <Card className="p-5 space-y-4 h-full">
            <div className="flex items-center gap-2"><FileText size={18} className="text-cyan-500" /><h3 className="font-semibold text-slate-800">Monthly Medical Report</h3></div>
            <div className="grid grid-cols-2 gap-3">
              <input type="month" className="input-field" value={monthly.month} onChange={(e) => setMonthly({ ...monthly, month: e.target.value })} required />
              <input className="input-field" placeholder="Region" value={monthly.region} onChange={(e) => setMonthly({ ...monthly, region: e.target.value })} required />
              <input className="input-field" placeholder="Dominant disease" value={monthly.dominantDisease} onChange={(e) => setMonthly({ ...monthly, dominantDisease: e.target.value })} />
              <input className="input-field" placeholder="Cases reviewed" value={monthly.totalCasesReviewed} onChange={(e) => setMonthly({ ...monthly, totalCasesReviewed: e.target.value })} />
            </div>
            <textarea className="input-field" rows={2} placeholder="Clinical summary" value={monthly.summary} onChange={(e) => setMonthly({ ...monthly, summary: e.target.value })} required />
            <textarea className="input-field" rows={2} placeholder="Recommendations (new line separated)" value={monthly.recommendations} onChange={(e) => setMonthly({ ...monthly, recommendations: e.target.value })} />
            <button className="btn-primary"><Save size={16} /> Save Report</button>
          </Card>
        </motion.form>

        {/* Bulk Entry */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
          <form onSubmit={submitBulk}>
            <Card className="p-5 space-y-4">
              <div className="flex items-center gap-2"><Database size={18} className="text-violet-500" /><h3 className="font-semibold text-slate-800">Bulk Data Entry</h3></div>
              <div className="grid grid-cols-3 gap-3">
                <input className="input-field" placeholder="Number of cases" value={bulk.numberOfCases} onChange={(e) => setBulk({ ...bulk, numberOfCases: e.target.value })} />
                <input className="input-field" placeholder="Disease type" value={bulk.diseaseType} onChange={(e) => setBulk({ ...bulk, diseaseType: e.target.value })} />
                <input className="input-field" placeholder="Region/City" value={bulk.region} onChange={(e) => setBulk({ ...bulk, region: e.target.value })} />
              </div>
              <button className="btn-primary">Add Bulk Cases</button>
            </Card>
          </form>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3"><BookOpen size={18} className="text-amber-500" /><h3 className="font-semibold text-slate-800">Report Library</h3></div>
            <div className="space-y-2 max-h-[200px] overflow-auto">
              {library.map((report) => (
                <div key={report._id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50 transition-colors">
                  <p className="font-medium text-slate-800">{report.patientId?.name || 'Patient'} · {report.originalName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{new Date(report.createdAt).toLocaleString()} · {report.tags?.join(', ') || 'No tags'}</p>
                </div>
              ))}
              {!library.length && <p className="text-sm text-slate-500">No patient uploads found yet.</p>}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function DiagnosisEditor({ record, onSave }) {
  const [state, setState] = useState({
    diseaseName: record.diagnosis?.diseaseName || '', severity: record.diagnosis?.severity || 'Mild',
    status: record.diagnosis?.status || 'Suspected', medicines: record.diagnosis?.medicines || '', advice: record.diagnosis?.advice || '',
  });
  return (
    <div className="space-y-1.5 min-w-[220px]">
      <input className="input-field py-1.5 text-xs" placeholder="Disease name" value={state.diseaseName} onChange={(e) => setState({ ...state, diseaseName: e.target.value })} />
      <div className="grid grid-cols-2 gap-1.5">
        <select className="input-field py-1.5 text-xs" value={state.severity} onChange={(e) => setState({ ...state, severity: e.target.value })}><option>Mild</option><option>Moderate</option><option>Severe</option></select>
        <select className="input-field py-1.5 text-xs" value={state.status} onChange={(e) => setState({ ...state, status: e.target.value })}><option>Suspected</option><option>Confirmed</option><option>Recovered</option></select>
      </div>
      <input className="input-field py-1.5 text-xs" placeholder="Medicines" value={state.medicines} onChange={(e) => setState({ ...state, medicines: e.target.value })} />
      <input className="input-field py-1.5 text-xs" placeholder="Advice" value={state.advice} onChange={(e) => setState({ ...state, advice: e.target.value })} />
      <button type="button" className="btn-primary py-1 px-3 text-xs" onClick={() => onSave(record._id, state)}>Save</button>
    </div>
  );
}
