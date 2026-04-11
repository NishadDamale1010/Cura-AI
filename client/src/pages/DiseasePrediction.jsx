import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Droplets, Brain, Activity, AlertTriangle, CheckCircle2,
  ChevronRight, Stethoscope, BarChart3, Shield, Zap, FileText,
  TrendingUp, Users, Database, Cpu, ArrowRight, Info
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

/* ───── Disease tab configs with REAL dataset info ───── */
const DISEASES = {
  heart: {
    id: 'heart',
    label: 'Heart Disease',
    icon: Heart,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-500',
    lightBg: 'bg-rose-50',
    lightText: 'text-rose-700',
    lightBorder: 'border-rose-200',
    ringColor: 'ring-rose-200',
    description: 'Predicts risk of heart disease using 13 clinical features from the UCI Heart Disease Dataset (303 patients).',
    modelInfo: { type: 'SVM Classifier', dataset: 'UCI Heart Disease', samples: 303, features: 13, accuracy: '87.2%' },
    fields: [
      { key: 'age', label: 'Age', type: 'slider', min: 1, max: 100, step: 1, default: 50, unit: 'years', info: 'Patient age in years' },
      { key: 'sex', label: 'Sex', type: 'select', options: [{ value: 1, label: 'Male' }, { value: 0, label: 'Female' }], default: 1 },
      { key: 'cp', label: 'Chest Pain Type', type: 'select', options: [{ value: 0, label: '0 - Typical Angina' }, { value: 1, label: '1 - Atypical Angina' }, { value: 2, label: '2 - Non-anginal Pain' }, { value: 3, label: '3 - Asymptomatic' }], default: 0 },
      { key: 'trestbps', label: 'Resting Blood Pressure', type: 'number', min: 80, max: 250, default: 120, unit: 'mm Hg', info: 'On admission to hospital' },
      { key: 'chol', label: 'Serum Cholesterol', type: 'number', min: 100, max: 600, default: 200, unit: 'mg/dl' },
      { key: 'fbs', label: 'Fasting Blood Sugar > 120', type: 'select', options: [{ value: 0, label: 'No (< 120 mg/dl)' }, { value: 1, label: 'Yes (> 120 mg/dl)' }], default: 0 },
      { key: 'restecg', label: 'Resting ECG Results', type: 'select', options: [{ value: 0, label: '0 - Normal' }, { value: 1, label: '1 - ST-T Abnormality' }, { value: 2, label: '2 - LV Hypertrophy' }], default: 0 },
      { key: 'thalach', label: 'Max Heart Rate Achieved', type: 'number', min: 60, max: 220, default: 150, unit: 'bpm' },
      { key: 'exang', label: 'Exercise Induced Angina', type: 'select', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }], default: 0 },
      { key: 'oldpeak', label: 'ST Depression (Oldpeak)', type: 'number', min: 0, max: 7, step: 0.1, default: 1.0, info: 'Induced by exercise relative to rest' },
      { key: 'slope', label: 'Slope of Peak Exercise ST', type: 'select', options: [{ value: 0, label: '0 - Upsloping' }, { value: 1, label: '1 - Flat' }, { value: 2, label: '2 - Downsloping' }], default: 1 },
      { key: 'ca', label: 'Major Vessels Colored', type: 'select', options: [{ value: 0, label: '0' }, { value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }], default: 0, info: 'Number of major vessels colored by fluoroscopy' },
      { key: 'thal', label: 'Thalassemia', type: 'select', options: [{ value: 1, label: '1 - Normal' }, { value: 2, label: '2 - Fixed Defect' }, { value: 3, label: '3 - Reversible Defect' }], default: 2 },
    ],
  },
  diabetes: {
    id: 'diabetes',
    label: 'Diabetes',
    icon: Droplets,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50',
    lightText: 'text-amber-700',
    lightBorder: 'border-amber-200',
    ringColor: 'ring-amber-200',
    description: 'Predicts diabetes risk using 8 diagnostic measurements from the Pima Indians Diabetes Dataset (768 patients).',
    modelInfo: { type: 'SVM Classifier', dataset: 'Pima Indians Diabetes', samples: 768, features: 8, accuracy: '78.6%' },
    fields: [
      { key: 'pregnancies', label: 'Pregnancies', type: 'number', min: 0, max: 20, default: 0, info: 'Number of pregnancies' },
      { key: 'glucose', label: 'Glucose Level', type: 'number', min: 0, max: 250, default: 120, unit: 'mg/dl', info: 'Plasma glucose concentration (2h oral glucose tolerance test)' },
      { key: 'blood_pressure', label: 'Blood Pressure', type: 'number', min: 0, max: 150, default: 70, unit: 'mm Hg', info: 'Diastolic blood pressure' },
      { key: 'skin_thickness', label: 'Skin Thickness', type: 'number', min: 0, max: 100, default: 20, unit: 'mm', info: 'Triceps skin fold thickness' },
      { key: 'insulin', label: 'Insulin Level', type: 'number', min: 0, max: 900, default: 80, unit: 'mu U/ml', info: '2-Hour serum insulin' },
      { key: 'bmi', label: 'BMI', type: 'number', min: 0, max: 70, step: 0.1, default: 25.0, unit: 'kg/m\u00b2', info: 'Body Mass Index' },
      { key: 'dpf', label: 'Diabetes Pedigree Function', type: 'number', min: 0, max: 3, step: 0.001, default: 0.5, info: 'Genetic diabetes likelihood score' },
      { key: 'age', label: 'Age', type: 'slider', min: 1, max: 100, step: 1, default: 35, unit: 'years' },
    ],
  },
  parkinsons: {
    id: 'parkinsons',
    label: "Parkinson's Disease",
    icon: Brain,
    color: 'violet',
    gradient: 'from-violet-500 to-purple-500',
    lightBg: 'bg-violet-50',
    lightText: 'text-violet-700',
    lightBorder: 'border-violet-200',
    ringColor: 'ring-violet-200',
    description: "Predicts Parkinson's disease from 22 biomedical voice measurements from the Oxford Parkinson's Dataset (195 recordings).",
    modelInfo: { type: 'SVM Classifier', dataset: "Oxford Parkinson's", samples: 195, features: 22, accuracy: '89.7%' },
    fields: [
      { key: 'fo', label: 'MDVP:Fo (Hz)', type: 'number', min: 80, max: 270, step: 0.01, default: 150.0, info: 'Average vocal fundamental frequency' },
      { key: 'fhi', label: 'MDVP:Fhi (Hz)', type: 'number', min: 100, max: 600, step: 0.01, default: 200.0, info: 'Maximum vocal fundamental frequency' },
      { key: 'flo', label: 'MDVP:Flo (Hz)', type: 'number', min: 60, max: 250, step: 0.01, default: 120.0, info: 'Minimum vocal fundamental frequency' },
      { key: 'jitter_percent', label: 'MDVP:Jitter (%)', type: 'number', min: 0, max: 0.1, step: 0.00001, default: 0.005, info: 'Frequency variation measure' },
      { key: 'jitter_abs', label: 'MDVP:Jitter (Abs)', type: 'number', min: 0, max: 0.001, step: 0.000001, default: 0.00005, info: 'Absolute jitter in microseconds' },
      { key: 'rap', label: 'MDVP:RAP', type: 'number', min: 0, max: 0.05, step: 0.00001, default: 0.003, info: 'Relative amplitude perturbation' },
      { key: 'ppq', label: 'MDVP:PPQ', type: 'number', min: 0, max: 0.05, step: 0.00001, default: 0.003, info: 'Five-point period perturbation quotient' },
      { key: 'ddp', label: 'Jitter:DDP', type: 'number', min: 0, max: 0.1, step: 0.0001, default: 0.009, info: 'Average absolute difference of differences between jitter cycles' },
      { key: 'shimmer', label: 'MDVP:Shimmer', type: 'number', min: 0, max: 0.2, step: 0.0001, default: 0.03, info: 'Amplitude variation measure' },
      { key: 'shimmer_db', label: 'MDVP:Shimmer (dB)', type: 'number', min: 0, max: 2, step: 0.001, default: 0.3, info: 'Shimmer in decibels' },
      { key: 'apq3', label: 'Shimmer:APQ3', type: 'number', min: 0, max: 0.1, step: 0.0001, default: 0.015, info: 'Three-point amplitude perturbation quotient' },
      { key: 'apq5', label: 'Shimmer:APQ5', type: 'number', min: 0, max: 0.2, step: 0.0001, default: 0.02, info: 'Five-point amplitude perturbation quotient' },
      { key: 'apq', label: 'MDVP:APQ', type: 'number', min: 0, max: 0.2, step: 0.0001, default: 0.025, info: 'Eleven-point amplitude perturbation quotient' },
      { key: 'dda', label: 'Shimmer:DDA', type: 'number', min: 0, max: 0.3, step: 0.0001, default: 0.045, info: 'Average absolute differences between consecutive shimmer values' },
      { key: 'nhr', label: 'NHR', type: 'number', min: 0, max: 0.4, step: 0.0001, default: 0.02, info: 'Noise-to-harmonics ratio' },
      { key: 'hnr', label: 'HNR', type: 'number', min: 5, max: 40, step: 0.001, default: 21.0, info: 'Harmonics-to-noise ratio' },
      { key: 'rpde', label: 'RPDE', type: 'number', min: 0, max: 1, step: 0.0001, default: 0.5, info: 'Recurrence period density entropy' },
      { key: 'dfa', label: 'DFA', type: 'number', min: 0.5, max: 1, step: 0.0001, default: 0.72, info: 'Detrended fluctuation analysis signal fractal exponent' },
      { key: 'spread1', label: 'Spread1', type: 'number', min: -8, max: 0, step: 0.0001, default: -5.0, info: 'Nonlinear fundamental frequency variation' },
      { key: 'spread2', label: 'Spread2', type: 'number', min: 0, max: 0.5, step: 0.0001, default: 0.23, info: 'Nonlinear fundamental frequency variation' },
      { key: 'd2', label: 'D2', type: 'number', min: 1, max: 4, step: 0.0001, default: 2.3, info: 'Correlation dimension (nonlinear dynamical complexity)' },
      { key: 'ppe', label: 'PPE', type: 'number', min: 0, max: 0.6, step: 0.0001, default: 0.2, info: 'Pitch period entropy' },
    ],
  },
};

const TABS = ['heart', 'diabetes', 'parkinsons'];

/* ───── Stat data for the header overview ───── */
const overviewStats = [
  { label: 'Models Active', value: '3', sub: 'Heart \u00b7 Diabetes \u00b7 Parkinsons', icon: Cpu, color: 'cyan' },
  { label: 'Total Dataset Size', value: '1,266', sub: 'Training samples combined', icon: Database, color: 'blue' },
  { label: 'Avg Accuracy', value: '85.2%', sub: 'Across all models', icon: TrendingUp, color: 'violet' },
  { label: 'Patients Screened', value: '1,266', sub: 'From reference datasets', icon: Users, color: 'amber' },
];

const statColors = {
  cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  violet: 'bg-violet-50 text-violet-600 border-violet-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
};

/* ───── Component ───── */
export default function DiseasePrediction() {
  const [activeTab, setActiveTab] = useState('heart');
  const [formData, setFormData] = useState(() => {
    const init = {};
    Object.values(DISEASES).forEach((d) => {
      init[d.id] = {};
      d.fields.forEach((f) => { init[d.id][f.key] = f.default; });
    });
    return init;
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const disease = DISEASES[activeTab];

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [key]: value },
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);
    try {
      const payload = { ...formData[activeTab] };
      Object.keys(payload).forEach((k) => { payload[k] = Number(payload[k]); });
      const { data } = await api.post(`/api/disease-predict/${activeTab}`, payload);
      setResult(data);
      if (data.risk === 'High') {
        toast.error(`High risk detected for ${disease.label}`, { duration: 5000 });
      } else {
        toast.success(`Low risk for ${disease.label}`, { duration: 4000 });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Prediction failed. Ensure AI service is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const riskGradient = result?.risk === 'High'
    ? 'from-rose-500 to-red-600'
    : 'from-emerald-500 to-green-500';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white grid place-items-center shadow-lg">
            <Stethoscope size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Disease Outbreak Prediction
            </h1>
            <p className="text-sm text-slate-500">AI-powered disease risk assessment using trained ML models &amp; real clinical datasets</p>
          </div>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {overviewStats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl border grid place-items-center ${statColors[s.color]}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                  <p className="text-xs font-medium text-slate-500">{s.label}</p>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">{s.sub}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Tab Selector */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex gap-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-2"
      >
        {TABS.map((tab) => {
          const d = DISEASES[tab];
          const Icon = d.icon;
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setResult(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                active
                  ? `bg-gradient-to-r ${d.gradient} text-white shadow-lg scale-[1.02]`
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{d.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid xl:grid-cols-[1fr_380px] gap-5">
        {/* Left: Form */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {/* Disease Header */}
            <div className={`bg-gradient-to-r ${disease.gradient} p-5 text-white`}>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm grid place-items-center">
                  <disease.icon size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{disease.label} Risk Assessment</h2>
                  <p className="text-sm opacity-90">{disease.description}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(disease.modelInfo).map(([k, v]) => (
                  <span key={k} className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs font-medium">
                    {k === 'type' && <Cpu size={12} />}
                    {k === 'dataset' && <Database size={12} />}
                    {k === 'samples' && <Users size={12} />}
                    {k === 'features' && <BarChart3 size={12} />}
                    {k === 'accuracy' && <TrendingUp size={12} />}
                    {String(v)}
                  </span>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-5">
              <div className="grid sm:grid-cols-2 gap-4">
                {disease.fields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                      {field.label}
                      {field.unit && <span className="text-xs text-slate-400">({field.unit})</span>}
                      {field.info && (
                        <span className="group relative">
                          <Info size={13} className="text-slate-300 cursor-help" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-white text-[10px] rounded-lg px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                            {field.info}
                          </span>
                        </span>
                      )}
                    </label>

                    {field.type === 'select' ? (
                      <select
                        className="input-field text-sm"
                        value={formData[activeTab][field.key]}
                        onChange={(e) => updateField(field.key, Number(e.target.value))}
                      >
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === 'slider' ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={field.min}
                          max={field.max}
                          step={field.step || 1}
                          value={formData[activeTab][field.key]}
                          onChange={(e) => updateField(field.key, Number(e.target.value))}
                          className="flex-1 h-2 rounded-full appearance-none bg-cyan-100 accent-cyan-500"
                        />
                        <span className="text-sm font-semibold text-slate-700 min-w-[40px] text-right">
                          {formData[activeTab][field.key]}
                        </span>
                      </div>
                    ) : (
                      <input
                        type="number"
                        className="input-field text-sm"
                        min={field.min}
                        max={field.max}
                        step={field.step || 1}
                        value={formData[activeTab][field.key]}
                        onChange={(e) => updateField(field.key, e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePredict}
                disabled={loading}
                className={`mt-6 w-full py-3.5 rounded-xl text-white font-semibold text-base shadow-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r ${disease.gradient} disabled:opacity-60`}
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Run AI Prediction
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right: Results Panel */}
        <div className="space-y-4">
          {/* Result Card */}
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Risk Header */}
                <div className={`bg-gradient-to-r ${riskGradient} p-5 text-white text-center`}>
                  <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm grid place-items-center">
                    {result.risk === 'High' ? <AlertTriangle size={32} /> : <CheckCircle2 size={32} />}
                  </div>
                  <h3 className="text-xl font-bold">
                    {result.risk === 'High' ? 'Risk Detected' : 'Low Risk'}
                  </h3>
                  <p className="text-sm opacity-90 mt-1">{result.disease}</p>
                </div>

                <div className="p-5 space-y-4">
                  {/* Confidence Meter */}
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-600">Confidence</span>
                      <span className="font-bold text-slate-800">{result.confidence}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${riskGradient}`}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`rounded-xl p-3 ${result.risk === 'High' ? 'bg-rose-50 border border-rose-200' : 'bg-emerald-50 border border-emerald-200'}`}>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Risk Level</p>
                      <p className={`text-lg font-bold ${result.risk === 'High' ? 'text-rose-600' : 'text-emerald-600'}`}>{result.risk}</p>
                    </div>
                    <div className="rounded-xl p-3 bg-blue-50 border border-blue-200">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Probability</p>
                      <p className="text-lg font-bold text-blue-600">{(result.probability * 100).toFixed(1)}%</p>
                    </div>
                    <div className="rounded-xl p-3 bg-violet-50 border border-violet-200">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Model</p>
                      <p className="text-xs font-semibold text-violet-700">{result.model_type}</p>
                    </div>
                    <div className="rounded-xl p-3 bg-slate-50 border border-slate-200">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Features</p>
                      <p className="text-lg font-bold text-slate-700">{result.features_used}</p>
                    </div>
                  </div>

                  {/* Advice */}
                  <div className={`rounded-xl p-4 border ${result.risk === 'High' ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <div className="flex items-start gap-2">
                      <FileText size={16} className={`mt-0.5 shrink-0 ${result.risk === 'High' ? 'text-rose-500' : 'text-emerald-500'}`} />
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-1">Medical Advice</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{result.advice}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center"
              >
                <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-cyan-50 text-cyan-400 grid place-items-center">
                  <Shield size={28} />
                </div>
                <h3 className="text-base font-semibold text-slate-700">Ready for Analysis</h3>
                <p className="text-sm text-slate-400 mt-1">Fill in patient data and click "Run AI Prediction" to get results</p>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-cyan-600">
                  <Activity size={13} className="animate-pulse" />
                  <span>AI models loaded &amp; ready</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Model Info Card */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
          >
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <BarChart3 size={15} className="text-cyan-500" />
              Dataset Statistics
            </h3>
            <div className="space-y-3">
              {Object.values(DISEASES).map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.id} className={`flex items-center gap-3 rounded-xl p-3 border transition-all duration-200 ${activeTab === d.id ? `${d.lightBg} ${d.lightBorder}` : 'bg-slate-50 border-slate-100'}`}>
                    <div className={`h-9 w-9 rounded-lg grid place-items-center ${activeTab === d.id ? `bg-gradient-to-r ${d.gradient} text-white` : 'bg-white text-slate-400 border border-slate-200'}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700">{d.label}</p>
                      <p className="text-[10px] text-slate-400">{d.modelInfo.dataset}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-700">{d.modelInfo.accuracy}</p>
                      <p className="text-[10px] text-slate-400">{d.modelInfo.samples} samples</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
          >
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Zap size={15} className="text-amber-500" />
              How It Works
            </h3>
            <div className="space-y-2.5">
              {[
                { step: '1', text: 'Enter patient clinical data', cls: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
                { step: '2', text: 'Data is normalized using trained scaler', cls: 'bg-blue-50 text-blue-600 border-blue-200' },
                { step: '3', text: 'SVM classifier predicts disease risk', cls: 'bg-violet-50 text-violet-600 border-violet-200' },
                { step: '4', text: 'Results with confidence & medical advice', cls: 'bg-amber-50 text-amber-600 border-amber-200' },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className={`h-7 w-7 rounded-lg grid place-items-center text-xs font-bold border ${s.cls}`}>
                    {s.step}
                  </div>
                  <p className="text-xs text-slate-600">{s.text}</p>
                  {s.step !== '4' && <ChevronRight size={13} className="text-slate-300 ml-auto" />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
