import { useMemo } from 'react';
import {
  Activity, HeartPulse, ShieldAlert, Skull, TrendingUp, Globe,
  Brain, Thermometer, Droplets, Wind, CloudRain,
  Shield, Users, Building2, Siren, FileText, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';

const trendData = [
  { time: '01:00', newCases: 90, totalCases: 40 },
  { time: '03:00', newCases: 120, totalCases: 60 },
  { time: '06:00', newCases: 210, totalCases: 90 },
  { time: '09:00', newCases: 180, totalCases: 135 },
  { time: '12:00', newCases: 195, totalCases: 170 },
  { time: '15:00', newCases: 230, totalCases: 205 },
  { time: '18:00', newCases: 265, totalCases: 235 },
  { time: '21:00', newCases: 300, totalCases: 275 },
];

const forecastData = [
  { day: 'Mon', cases: 120, predicted: 130 },
  { day: 'Tue', cases: 150, predicted: 145 },
  { day: 'Wed', cases: 180, predicted: 175 },
  { day: 'Thu', cases: 160, predicted: 190 },
  { day: 'Fri', cases: null, predicted: 210 },
  { day: 'Sat', cases: null, predicted: 195 },
  { day: 'Sun', cases: null, predicted: 180 },
];

const diseaseBreakdown = [
  { name: 'COVID-19', value: 68.5, color: '#06b6d4' },
  { name: 'Influenza', value: 12.3, color: '#8b5cf6' },
  { name: 'Dengue', value: 8.7, color: '#f59e0b' },
  { name: 'Malaria', value: 5.1, color: '#ef4444' },
  { name: 'Others', value: 5.4, color: '#94a3b8' },
];

const riskGaugeData = [{ name: 'Risk', value: 72, fill: '#f59e0b' }];

const envFactors = [
  { label: 'Temperature', value: '34.2 C', icon: Thermometer, color: 'text-rose-500 bg-rose-50', trend: '+2.1' },
  { label: 'Humidity', value: '78%', icon: Droplets, color: 'text-blue-500 bg-blue-50', trend: '+5%' },
  { label: 'Air Quality', value: 'Poor', icon: Wind, color: 'text-amber-500 bg-amber-50', trend: 'AQI 180' },
  { label: 'Rainfall', value: '12mm', icon: CloudRain, color: 'text-cyan-500 bg-cyan-50', trend: 'Heavy' },
];

const aiRecommendations = [
  { text: 'Deploy rapid testing units in Pimpri-Chinchwad zone', priority: 'high', icon: Siren },
  { text: 'Increase hospital bed capacity by 15% in Pune East', priority: 'high', icon: Building2 },
  { text: 'Issue public advisory for dengue prevention measures', priority: 'medium', icon: FileText },
  { text: 'Schedule vaccination drive in high-risk age groups (50+)', priority: 'medium', icon: Users },
];

const commandActions = [
  { label: 'Deploy Response Team', icon: Users, color: 'from-cyan-500 to-blue-500' },
  { label: 'Issue Public Advisory', icon: FileText, color: 'from-amber-500 to-orange-500' },
  { label: 'Activate Emergency Protocol', icon: Siren, color: 'from-rose-500 to-red-500' },
  { label: 'Request Resources', icon: Building2, color: 'from-violet-500 to-purple-500' },
];

const statCards = [
  { title: 'Total Cases', value: '4,46,738', trend: '+2.4%', icon: Activity, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
  { title: 'Active Cases', value: '1,247', trend: '-1.2%', icon: HeartPulse, color: 'bg-rose-50 text-rose-600 border-rose-100' },
  { title: 'Recovery Rate', value: '94.2%', trend: '+3.8%', icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { title: 'Deaths', value: '247', trend: '-0.5%', icon: Skull, color: 'bg-slate-50 text-slate-600 border-slate-100' },
  { title: 'High Risk Zones', value: '12', trend: '+2 new', icon: ShieldAlert, color: 'bg-amber-50 text-amber-600 border-amber-100' },
];

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
    {children}
  </div>
);

export default function DoctorDashboard() {
  const motionContainer = useMemo(() => ({
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  }), []);

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white grid place-items-center shadow-lg">
            <Globe size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">AI Disease Prediction System</h1>
            <p className="text-sm text-slate-500">Real-time epidemic monitoring with AI-powered intelligence</p>
          </div>
          <span className="ml-auto text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-medium flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE 24/7
          </span>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={motionContainer} initial="hidden" animate="show" className="grid grid-cols-2 xl:grid-cols-5 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          const isPositive = card.trend.startsWith('+');
          const isNegative = card.trend.startsWith('-');
          return (
            <motion.div key={card.title} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.02 }}>
              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">{card.title}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
                    <p className={`text-xs mt-1 font-medium ${isPositive ? 'text-emerald-500' : isNegative ? 'text-rose-500' : 'text-slate-400'}`}>{card.trend}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-xl border grid place-items-center ${card.color}`}><Icon size={18} /></div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Row 1: Trend + Risk Gauge + Disease Breakdown */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid lg:grid-cols-[1.5fr_0.6fr_0.9fr] gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Brain size={16} className="text-cyan-500" /><h3 className="font-semibold text-slate-800">AI Prediction vs Actual Cases</h3></div>
            <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">24h</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} /><stop offset="95%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="newCases" name="New Cases" stroke="#06b6d4" strokeWidth={2.5} fill="url(#colorNew)" />
                <Area type="monotone" dataKey="totalCases" name="Predicted" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#colorTotal)" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 flex flex-col items-center justify-center">
          <h3 className="font-semibold text-slate-800 mb-2 text-sm">Risk Assessment</h3>
          <div className="h-40 w-40">
            <ResponsiveContainer>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" startAngle={180} endAngle={0} data={riskGaugeData} barSize={12}>
                <RadialBar background clockWise dataKey="value" cornerRadius={6} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-3xl font-bold text-amber-500 -mt-8">72%</p>
          <p className="text-xs text-slate-500 mt-1">Medium-High Risk</p>
          <div className="flex gap-2 mt-3 w-full">
            <div className="flex-1 text-center py-1.5 rounded-lg bg-red-50 border border-red-100"><p className="text-[10px] text-red-500 font-medium">High</p><p className="text-sm font-bold text-red-600">4</p></div>
            <div className="flex-1 text-center py-1.5 rounded-lg bg-amber-50 border border-amber-100"><p className="text-[10px] text-amber-500 font-medium">Med</p><p className="text-sm font-bold text-amber-600">8</p></div>
            <div className="flex-1 text-center py-1.5 rounded-lg bg-green-50 border border-green-100"><p className="text-[10px] text-green-500 font-medium">Low</p><p className="text-sm font-bold text-green-600">15</p></div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 mb-3 text-sm">Disease Distribution</h3>
          <div className="h-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={diseaseBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {diseaseBreakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
            {diseaseBreakdown.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-slate-600">{d.name}</span>
                <span className="text-xs font-bold text-slate-800 ml-auto">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Row 2: Forecast + Env Factors + AI Recommendations */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4"><TrendingUp size={16} className="text-cyan-500" /><h3 className="font-semibold text-slate-800">7-Day Outbreak Forecast</h3></div>
          <div className="h-48">
            <ResponsiveContainer>
              <BarChart data={forecastData}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Bar dataKey="cases" name="Actual" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="predicted" name="Predicted" fill="#c4b5fd" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4"><Thermometer size={16} className="text-rose-500" /><h3 className="font-semibold text-slate-800">Environmental Factors</h3></div>
          <div className="space-y-3">
            {envFactors.map((f) => {
              const FIcon = f.icon;
              return (
                <div key={f.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg grid place-items-center ${f.color}`}><FIcon size={16} /></div>
                    <div><p className="text-sm font-medium text-slate-700">{f.label}</p><p className="text-xs text-slate-400">{f.trend}</p></div>
                  </div>
                  <p className="text-lg font-bold text-slate-800">{f.value}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4"><Brain size={16} className="text-violet-500" /><h3 className="font-semibold text-slate-800">AI Recommendations</h3></div>
          <div className="space-y-3">
            {aiRecommendations.map((rec) => {
              const RIcon = rec.icon;
              return (
                <div key={rec.text} className={`flex items-start gap-3 p-3 rounded-xl border ${rec.priority === 'high' ? 'bg-rose-50/50 border-rose-100' : 'bg-amber-50/50 border-amber-100'}`}>
                  <div className={`h-8 w-8 rounded-lg grid place-items-center shrink-0 ${rec.priority === 'high' ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-500'}`}><RIcon size={14} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{rec.text}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${rec.priority === 'high' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>{rec.priority === 'high' ? 'Critical' : 'Important'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Row 3: Authority Command Center */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Shield size={16} className="text-cyan-500" /><h3 className="font-semibold text-slate-800">Authority Command Center</h3></div>
            <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">Quick Actions</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {commandActions.map((action) => {
              const AIcon = action.icon;
              return (
                <button 
                  key={action.label} 
                  onClick={() => toast.success(`Action Executed: ${action.label}`)}
                  className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}>
                  <div className="h-10 w-10 rounded-xl bg-white/20 grid place-items-center"><AIcon size={18} /></div>
                  <span className="text-sm font-medium">{action.label}</span>
                  <ChevronRight size={16} className="ml-auto opacity-70" />
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-100 text-center"><p className="text-2xl font-bold text-cyan-600">24</p><p className="text-xs text-slate-500">Response Teams Active</p></div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center"><p className="text-2xl font-bold text-emerald-600">156</p><p className="text-xs text-slate-500">Hospitals Connected</p></div>
            <div className="p-3 rounded-xl bg-violet-50 border border-violet-100 text-center"><p className="text-2xl font-bold text-violet-600">89%</p><p className="text-xs text-slate-500">Resource Utilization</p></div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-center"><p className="text-2xl font-bold text-amber-600">12</p><p className="text-xs text-slate-500">Active Alerts</p></div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
