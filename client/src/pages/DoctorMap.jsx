import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Map, Filter, Layers, AlertTriangle, TrendingUp, Users,
  ChevronRight, Search, Building2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const regions = [
  { name: 'Pune City', cases: 342, risk: 'High', lat: '35%', lng: '45%', color: '#ef4444', deaths: 12, recovered: 280 },
  { name: 'Pimpri-Chinchwad', cases: 189, risk: 'High', lat: '20%', lng: '30%', color: '#ef4444', deaths: 5, recovered: 140 },
  { name: 'Hinjewadi', cases: 95, risk: 'Medium', lat: '55%', lng: '25%', color: '#f59e0b', deaths: 2, recovered: 80 },
  { name: 'Kharadi', cases: 67, risk: 'Medium', lat: '30%', lng: '72%', color: '#f59e0b', deaths: 1, recovered: 55 },
  { name: 'Hadapsar', cases: 45, risk: 'Low', lat: '70%', lng: '65%', color: '#22c55e', deaths: 0, recovered: 42 },
  { name: 'Baner', cases: 38, risk: 'Low', lat: '42%', lng: '18%', color: '#22c55e', deaths: 0, recovered: 35 },
  { name: 'Wakad', cases: 28, risk: 'Low', lat: '15%', lng: '55%', color: '#22c55e', deaths: 0, recovered: 25 },
];

const regionBarData = regions.map((r) => ({ name: r.name.split(' ')[0], cases: r.cases, recovered: r.recovered }));

const diseaseFilters = ['All Diseases', 'COVID-19', 'Dengue', 'Malaria', 'Influenza', 'Cholera'];
const timeFilters = ['24 Hours', '7 Days', '30 Days', '90 Days'];

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>{children}</div>
);

export default function DoctorMap() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [diseaseFilter, setDiseaseFilter] = useState('All Diseases');
  const [timeFilter, setTimeFilter] = useState('7 Days');

  const totalCases = regions.reduce((s, r) => s + r.cases, 0);
  const highRisk = regions.filter((r) => r.risk === 'High').length;
  const medRisk = regions.filter((r) => r.risk === 'Medium').length;

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white grid place-items-center shadow-lg"><Map size={22} /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Interactive Risk Map</h1>
            <p className="text-sm text-slate-500">Geographic disease surveillance and hotspot analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-medium flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Data
          </span>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600"><Filter size={14} /><span className="font-medium">Filters:</span></div>
            <div className="flex flex-wrap gap-2">
              {diseaseFilters.map((d) => (
                <button key={d} onClick={() => setDiseaseFilter(d)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${diseaseFilter === d ? 'bg-cyan-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{d}</button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              {timeFilters.map((t) => (
                <button key={t} onClick={() => setTimeFilter(t)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${timeFilter === t ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{t}</button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Content: Map + Sidebar */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid lg:grid-cols-[1fr_380px] gap-4">
        {/* Map Area */}
        <Card className="p-5 min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Layers size={16} className="text-cyan-500" /> Pune District Risk Zones</h3>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-500" /> High</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-amber-500" /> Medium</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-green-500" /> Low</span>
            </div>
          </div>
          <div className="relative h-[420px] rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 border border-slate-200">
            {/* Grid lines for map effect */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            {regions.map((region) => (
              <button
                key={region.name}
                onClick={() => setSelectedRegion(region)}
                className="absolute flex flex-col items-center group cursor-pointer"
                style={{ top: region.lat, left: region.lng }}
              >
                <span className="h-8 w-8 rounded-full animate-ping absolute opacity-20" style={{ backgroundColor: region.color }} />
                <span className="h-8 w-8 rounded-full relative z-10 border-3 border-white shadow-lg grid place-items-center text-white text-[10px] font-bold group-hover:scale-125 transition-transform" style={{ backgroundColor: region.color }}>
                  {region.cases}
                </span>
                <span className="text-xs font-bold mt-1.5 bg-white/95 px-2 py-0.5 rounded-lg shadow-sm relative z-10 group-hover:bg-slate-800 group-hover:text-white transition-colors">{region.name}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Summary Stats */}
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800 text-sm mb-3">Regional Summary</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xl font-bold text-slate-800">{totalCases}</p>
                <p className="text-[10px] text-slate-500">Total Cases</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-red-50 border border-red-100">
                <p className="text-xl font-bold text-red-600">{highRisk}</p>
                <p className="text-[10px] text-slate-500">High Risk</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-xl font-bold text-amber-600">{medRisk}</p>
                <p className="text-[10px] text-slate-500">Medium Risk</p>
              </div>
            </div>
          </Card>

          {/* Selected Region Detail */}
          {selectedRegion && (
            <Card className="p-4">
              <h3 className="font-semibold text-slate-800 text-sm mb-2 flex items-center gap-2">
                <Building2 size={14} className="text-cyan-500" /> {selectedRegion.name}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Total Cases</span><span className="font-bold text-slate-800">{selectedRegion.cases}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Recovered</span><span className="font-bold text-emerald-600">{selectedRegion.recovered}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Deaths</span><span className="font-bold text-rose-600">{selectedRegion.deaths}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Risk Level</span><span className={`font-bold px-2 py-0.5 rounded-full text-xs ${selectedRegion.risk === 'High' ? 'bg-red-100 text-red-600' : selectedRegion.risk === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>{selectedRegion.risk}</span></div>
              </div>
            </Card>
          )}

          {/* Region List */}
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" /> All Regions
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-auto">
              {regions.map((r) => (
                <button key={r.name} onClick={() => setSelectedRegion(r)} className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-sm text-slate-700 font-medium">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{r.cases}</span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Cases Comparison Chart */}
          <Card className="p-4">
            <h3 className="font-semibold text-slate-800 text-sm mb-3">Cases by Region</h3>
            <div className="h-36">
              <ResponsiveContainer>
                <BarChart data={regionBarData} layout="vertical">
                  <CartesianGrid stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={50} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="cases" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
