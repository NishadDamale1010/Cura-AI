import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Tag, Flag, FolderOpen } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const initialFlags = { highFever: false, lowSpo2: false, respiratoryDistress: false };
const flagLabels = { highFever: 'High Fever', lowSpo2: 'Low SpO2', respiratoryDistress: 'Respiratory Distress' };

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>{children}</div>
);

export default function MedicalUploads() {
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('cbc,blood-test');
  const [flags, setFlags] = useState(initialFlags);
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState({ loading: false, error: '' });

  const loadReports = async () => { const { data } = await api.get('/api/reports/mine'); setReports(data.reports || []); };
  useEffect(() => { loadReports().catch(() => toast.error('Unable to load reports')); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    if (selected.size > 10 * 1024 * 1024) {
      setStatus({ loading: false, error: 'File exceeds 10MB upload limit.', message: '' });
      return;
    }
    setStatus({ loading: true, error: '', message: '' });
    try {
      const form = new FormData();
      form.append('file', selected); form.append('notes', notes); form.append('tags', tags);
      Object.entries(flags).forEach(([k, v]) => form.append(k, String(v)));
      await api.post('/api/reports/patient/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSelected(null); setNotes(''); setTags('cbc,blood-test'); setFlags(initialFlags); await loadReports();
      setStatus({ loading: false, error: '' });
      toast.success('Report uploaded successfully');
    } catch (err) {
      setStatus({ loading: false, error: err.userMessage || err.response?.data?.message || 'Upload failed', message: '' });
    }
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white grid place-items-center shadow-lg"><Upload size={22} /></div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medical Report Upload</h1>
          <p className="text-sm text-slate-500">Upload lab reports and mark clinical flags for AI scoring</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="p-6">
          <form onSubmit={submit} className="space-y-5">
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center hover:border-cyan-300 transition-colors">
              <Upload size={32} className="mx-auto text-cyan-400 mb-2" />
              <p className="text-sm text-slate-600 mb-3">{selected ? selected.name : 'Choose a file to upload'}</p>
              <input type="file" accept=".pdf,image/*" onChange={(e) => setSelected(e.target.files?.[0] || null)}
                className="text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-cyan-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-cyan-700 hover:file:bg-cyan-100 file:cursor-pointer file:transition-colors" required />
            </div>

            <div className="relative"><Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="input-field pl-9" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} /></div>
            <textarea className="input-field" placeholder="Notes for doctor" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />

            <div>
              <div className="flex items-center gap-1.5 mb-2"><Flag size={14} className="text-rose-500" /><p className="text-sm font-semibold text-slate-700">Clinical Flags</p></div>
              <div className="grid sm:grid-cols-3 gap-2 text-sm">
                {Object.keys(flags).map((key) => (
                  <label key={key} className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 cursor-pointer transition-all duration-200 ${flags[key] ? 'border-cyan-400 bg-cyan-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                    <input type="checkbox" className="accent-cyan-500" checked={flags[key]} onChange={(e) => setFlags((f) => ({ ...f, [key]: e.target.checked }))} />
                    <span className={flags[key] ? 'font-medium text-cyan-700' : 'text-slate-600'}>{flagLabels[key] || key}</span>
                  </label>
                ))}
              </div>
            </div>

            <button disabled={!selected || status.loading} className="btn-primary disabled:opacity-60"><Upload size={16} />{status.loading ? 'Uploading...' : 'Upload Report'}</button>
            {status.error && <p className="text-sm text-rose-600">{status.error}</p>}
          </form>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3"><FolderOpen size={18} className="text-amber-500" /><h3 className="font-semibold text-slate-800">Uploaded Reports</h3></div>
          <div className="space-y-2">
            {reports.map((report) => (
              <a key={report._id} href={`${import.meta.env.VITE_API_URL || ''}${report.fileUrl}`} target="_blank" rel="noreferrer"
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50 hover:shadow-sm transition-all duration-200">
                <div className="h-9 w-9 rounded-lg bg-cyan-50 grid place-items-center shrink-0 mt-0.5"><FileText size={16} className="text-cyan-600" /></div>
                <div>
                  <p className="font-medium text-slate-800">{report.originalName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{new Date(report.createdAt).toLocaleString()} · {(report.size / 1024).toFixed(1)} KB</p>
                  <p className="text-sm text-slate-600 mt-0.5">{report.notes || 'No notes added.'}</p>
                </div>
              </a>
            ))}
            {!reports.length && <p className="text-sm text-slate-500">No reports uploaded yet.</p>}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
