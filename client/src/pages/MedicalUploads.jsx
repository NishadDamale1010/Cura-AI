import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Flag, FolderOpen, Brain, CheckCircle2,
  AlertCircle, Loader2, X, FileImage, FilePlus, Activity,
  ChevronDown, ChevronUp, Zap, ShieldAlert, ClipboardList
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const INITIAL_FLAGS = { highFever: false, lowSpo2: false, respiratoryDistress: false };
const FLAG_META = {
  highFever: { label: 'High Fever', icon: '🌡️', color: 'rose' },
  lowSpo2: { label: 'Low SpO2', icon: '💨', color: 'blue' },
  respiratoryDistress: { label: 'Respiratory Distress', icon: '🫁', color: 'violet' },
};

const SEVERITY_STYLES = {
  high:   'bg-rose-100 text-rose-700 border-rose-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low:    'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const RISK_COLOR = {
  High:     { ring: 'ring-rose-500/30',   bg: 'from-rose-500 to-rose-600',   text: 'text-rose-600',   light: 'bg-rose-50 border-rose-200' },
  Moderate: { ring: 'ring-amber-500/30',  bg: 'from-amber-500 to-orange-500', text: 'text-amber-600',  light: 'bg-amber-50 border-amber-200' },
  Low:      { ring: 'ring-emerald-500/30',bg: 'from-emerald-500 to-teal-500', text: 'text-emerald-600',light: 'bg-emerald-50 border-emerald-200' },
};

function FileIcon({ mime }) {
  if (mime?.startsWith('image/')) return <FileImage size={18} className="text-violet-500" />;
  return <FileText size={18} className="text-cyan-500" />;
}

export default function MedicalUploads() {
  const inputRef = useRef(null);
  const [dragging, setDragging]   = useState(false);
  const [selected, setSelected]   = useState(null);
  const [notes, setNotes]         = useState('');
  const [tags, setTags]           = useState('');
  const [flags, setFlags]         = useState(INITIAL_FLAGS);
  const [reportText, setReportText] = useState('');
  const [reports, setReports]      = useState([]);
  const [uploading, setUploading]  = useState(false);
  const [analyzing, setAnalyzing]  = useState(false);
  const [analysis, setAnalysis]    = useState(null);
  const [expandedReport, setExpandedReport] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const loadReports = useCallback(async () => {
    try {
      const { data } = await api.get('/api/reports/mine');
      setReports(data.reports || []);
    } catch {
      toast.error('Could not load reports.');
    }
  }, []);

  useEffect(() => { loadReports(); }, [loadReports]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSet(file);
  }, []);

  const validateAndSet = (file) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Only PDF, JPG, PNG, or WEBP files are supported.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File exceeds the 10MB limit.');
      return;
    }
    setSelected(file);
    setAnalysis(null);
    setUploadError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) { toast.error('Please select a file to upload.'); return; }

    setUploadError('');
    setUploading(true);
    const tid = toast.loading('Uploading report...');

    try {
      const form = new FormData();
      form.append('file', selected);
      form.append('notes', notes);
      form.append('tags', tags);
      Object.entries(flags).forEach(([k, v]) => form.append(k, String(v)));

      await api.post('/api/reports/patient/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.dismiss(tid);
      toast.success('Report uploaded successfully!');
      setSelected(null);
      setNotes('');
      setTags('');
      setFlags(INITIAL_FLAGS);
      setReportText('');
      await loadReports();
    } catch (err) {
      toast.dismiss(tid);
      const msg = err.response?.data?.message || 'Upload failed. Please try again.';
      setUploadError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const runAnalysis = async () => {
    if (!reportText.trim() && !Object.values(flags).some(Boolean)) {
      toast.error('Paste some report text or mark clinical flags to analyze.');
      return;
    }
    setAnalysis(null);
    setAnalyzing(true);
    const tid = toast.loading('AI is analyzing your report...');
    try {
      const tagArr = tags.split(',').map((t) => t.trim()).filter(Boolean);
      const { data } = await api.post('/api/reports/analyze', {
        reportText,
        notes,
        tags: tagArr,
        highFever: flags.highFever,
        lowSpo2: flags.lowSpo2,
        respiratoryDistress: flags.respiratoryDistress,
      });
      setAnalysis(data);
      toast.dismiss(tid);
      toast.success(`Analysis complete – ${data.riskLevel} Risk detected.`);
    } catch (err) {
      toast.dismiss(tid);
      toast.error('AI analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const rc = analysis ? (RISK_COLOR[analysis.riskLevel] || RISK_COLOR.Low) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white grid place-items-center shadow-glow-violet">
          <FilePlus size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-800">Medical Report Upload</h1>
          <p className="text-sm text-slate-500">Upload lab reports and get AI-powered clinical analysis</p>
        </div>
      </motion.div>

      {/* ── Upload Card ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <form onSubmit={handleSubmit} className="card divide-y divide-slate-100/80">

          {/* Drag-and-Drop Zone */}
          <div className="p-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300
                ${dragging
                  ? 'border-violet-400 bg-violet-50/60 scale-[1.01] shadow-glow-violet'
                  : selected
                  ? 'border-emerald-400 bg-emerald-50/50'
                  : 'border-slate-200 bg-slate-50/50 hover:border-cyan-300 hover:bg-cyan-50/30'
                }`}
            >
              <input ref={inputRef} type="file" accept=".pdf,image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) validateAndSet(f); }} />

              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div key="selected" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-100 grid place-items-center">
                      <CheckCircle2 size={28} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 font-display">{selected.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{(selected.size / 1024).toFixed(1)} KB · {selected.type}</p>
                    </div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setSelected(null); }}
                      className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-700 font-semibold mt-1">
                      <X size={14} /> Remove file
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-3">
                    <div className={`h-14 w-14 rounded-2xl grid place-items-center transition-all ${dragging ? 'bg-violet-100 animate-bounce' : 'bg-slate-100'}`}>
                      <Upload size={26} className={dragging ? 'text-violet-500' : 'text-slate-400'} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 font-display">Drag & drop or click to browse</p>
                      <p className="text-xs text-slate-400 mt-1">Supports PDF, JPG, PNG, WEBP · Max 10MB</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Metadata */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList size={16} className="text-slate-400" />
              <h3 className="text-sm font-bold text-slate-700 font-display uppercase tracking-wide">Report Details</h3>
            </div>
            <input className="input-field" placeholder="Tags (e.g. cbc, blood-test, urine)" value={tags}
              onChange={(e) => setTags(e.target.value)} />
            <textarea className="input-field resize-none" placeholder="Notes for doctor (optional)" value={notes}
              onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>

          {/* Clinical Flags */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flag size={16} className="text-rose-500" />
              <h3 className="text-sm font-bold text-slate-700 font-display uppercase tracking-wide">Clinical Flags</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {Object.entries(FLAG_META).map(([key, meta]) => (
                <label key={key} className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all duration-200
                  ${flags[key]
                    ? 'border-cyan-400 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-soft'
                    : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <input type="checkbox" className="accent-cyan-500 w-4 h-4 rounded" checked={flags[key]}
                    onChange={(e) => setFlags((f) => ({ ...f, [key]: e.target.checked }))} />
                  <span className="text-lg leading-none">{meta.icon}</span>
                  <span className={`text-sm font-semibold ${flags[key] ? 'text-cyan-700' : 'text-slate-600'}`}>{meta.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {uploadError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mx-6 mb-2 flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="text-sm text-rose-700">{uploadError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Button */}
          <div className="p-6">
            <button type="submit" disabled={!selected || uploading}
              className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              {uploading
                ? <><Loader2 size={18} className="animate-spin" /> Uploading...</>
                : <><Upload size={18} /> Upload Report</>}
            </button>
          </div>
        </form>
      </motion.div>

      {/* ── AI Analysis Card ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain size={20} className="text-violet-500" />
              <h2 className="font-bold text-slate-800 font-display">AI Report Analysis</h2>
            </div>
            <span className="badge bg-violet-100 text-violet-700 border-violet-200 text-xs">Instant • Multi-Signal</span>
          </div>

          <p className="text-sm text-slate-500">Paste report text below (CBC, blood test, etc.) along with clinical flags to get an AI-powered differential analysis.</p>

          <textarea
            className="input-field resize-none"
            placeholder="Paste lab report text here... e.g. Hemoglobin: 8.5 g/dL, Platelets: 80,000/μL, WBC: 12,000/μL, Fever: 38.9°C, SpO2: 94%..."
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            rows={6}
          />

          <button onClick={runAnalysis} disabled={analyzing}
            className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
            {analyzing
              ? <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
              : <><Zap size={18} /> Run AI Analysis</>}
          </button>

          {/* Analysis Result */}
          <AnimatePresence>
            {analysis && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`rounded-2xl border-2 p-6 space-y-5 ${rc.light}`}>

                {/* Risk Gauge Head */}
                <div className="flex items-center gap-4">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${rc.bg} text-white grid place-items-center shadow-lg ring-4 ${rc.ring} shrink-0`}>
                    <ShieldAlert size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-black font-display text-slate-800">AI Risk Report</h3>
                      <span className={`badge ${rc.light} border font-bold text-sm`}>{analysis.riskLevel} Risk</span>
                      <span className="badge bg-slate-100 text-slate-500 border-slate-200 text-xs">{analysis.analysisDepth} Analysis</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-4xl font-black font-display ${rc.text}`}>{analysis.riskScore}</span>
                      <span className="text-slate-400 font-medium">/100 risk score</span>
                      <span className="text-sm text-slate-500">· {analysis.totalSignals} signal(s) detected</span>
                    </div>
                  </div>
                </div>

                {/* Risk Bar */}
                <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.riskScore}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${rc.bg}`}
                  />
                </div>

                {/* Findings */}
                {analysis.findings?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 font-display">Key Findings</p>
                    <div className="space-y-2.5">
                      {analysis.findings.map((f, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border ${SEVERITY_STYLES[f.severity] || SEVERITY_STYLES.low}`}>
                          <span className="text-xl leading-none shrink-0 mt-0.5">{f.icon}</span>
                          <div>
                            <p className="font-bold text-sm">{f.label}</p>
                            <p className="text-xs mt-0.5 opacity-80">{f.detail}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Differential Diagnosis */}
                {analysis.differentials?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 font-display">Differential Diagnosis Hints</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.differentials.map((d, i) => (
                        <span key={i} className="badge bg-violet-100 text-violet-700 border-violet-200">{d}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Actions */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 font-display">Recommended Actions</p>
                  <ul className="space-y-2">
                    {analysis.actions.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <Activity size={14} className="text-cyan-500 mt-0.5 shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-[10px] text-slate-400 text-right">
                  Generated {new Date(analysis.generatedAt).toLocaleString()} · AI pattern-matching engine v2
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Report History ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <FolderOpen size={20} className="text-amber-500" />
            <h2 className="font-bold text-slate-800 font-display">Uploaded Reports</h2>
            {reports.length > 0 && (
              <span className="ml-auto badge bg-amber-100 text-amber-700 border-amber-200">{reports.length} report{reports.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FolderOpen size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No reports uploaded yet.</p>
              <p className="text-xs mt-1">Upload your first report above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r, i) => (
                <motion.div key={r._id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden hover:border-slate-200 hover:shadow-soft transition-all duration-300">
                  <button type="button" onClick={() => setExpandedReport(expandedReport === r._id ? null : r._id)}
                    className="flex items-center gap-3 w-full p-4 text-left">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 shadow-sm grid place-items-center shrink-0">
                      <FileIcon mime={r.mimeType} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{r.originalName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(r.createdAt).toLocaleString()} · {(r.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {r.clinicalFlags && Object.entries(r.clinicalFlags).some(([, v]) => v) && (
                        <span className="badge badge-rose text-xs">Flagged</span>
                      )}
                      {expandedReport === r._id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedReport === r._id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100 p-4 space-y-3 bg-white">
                        {r.notes && <p className="text-sm text-slate-600"><span className="font-semibold">Notes:</span> {r.notes}</p>}
                        {r.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {r.tags.map((tag) => <span key={tag} className="badge bg-cyan-100 text-cyan-700 border-cyan-200 text-xs">{tag}</span>)}
                          </div>
                        )}
                        {r.clinicalFlags && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(r.clinicalFlags).filter(([, v]) => v).map(([k]) => (
                              <span key={k} className="badge badge-rose">{FLAG_META[k]?.icon} {FLAG_META[k]?.label}</span>
                            ))}
                          </div>
                        )}
                        <a href={`${import.meta.env.VITE_API_URL || ''}${r.fileUrl}`} target="_blank" rel="noreferrer"
                          className="btn-outline text-sm inline-flex">
                          <FileText size={14} /> View Full Report
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

    </div>
  );
}
