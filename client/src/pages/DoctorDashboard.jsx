import { useMemo } from 'react';
import { Activity, HeartPulse, ShieldAlert, Skull, TrendingUp, Globe, Stethoscope, BarChart3, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import TrendChart from '../components/dashboard/charts/TrendChart';
import DonutChart from '../components/dashboard/charts/DonutChart';
import AgeBarChart from '../components/dashboard/charts/AgeBarChart';
import PredictionChart from '../components/dashboard/charts/PredictionChart';
import Alerts from '../components/dashboard/Alerts';
import RiskMap from '../components/dashboard/Map/RiskMap';
import AIInsights from '../components/dashboard/AIInsights';
import LiveFeed from '../components/dashboard/LiveFeed';

const trendData = [
  { time: '01:00', newCases: 90000, totalCases: 40000 },
  { time: '03:00', newCases: 120000, totalCases: 60000 },
  { time: '06:00', newCases: 210000, totalCases: 90000 },
  { time: '09:00', newCases: 180000, totalCases: 135000 },
  { time: '12:00', newCases: 195000, totalCases: 170000 },
  { time: '15:00', newCases: 230000, totalCases: 205000 },
  { time: '18:00', newCases: 265000, totalCases: 235000 },
  { time: '21:00', newCases: 300000, totalCases: 275000 },
];

const diseaseData = [
  { name: 'COVID-19', value: 68.5 },
  { name: 'Influenza', value: 12.3 },
  { name: 'Dengue', value: 8.7 },
  { name: 'Malaria', value: 5.1 },
  { name: 'Others', value: 5.4 },
];

const ageData = [
  { group: '0-17', value: 12000 },
  { group: '18-29', value: 18000 },
  { group: '30-49', value: 26000 },
  { group: '50-64', value: 30000 },
  { group: '65+', value: 20000 },
];

const predictionData = [
  { date: 'Apr 20', current: 430, predicted: 420 },
  { date: 'Apr 23', current: 310, predicted: 300 },
  { date: 'Apr 26', current: 250, predicted: 240 },
  { date: 'Apr 29', current: 210, predicted: 200 },
  { date: 'May 02', current: 180, predicted: 170 },
  { date: 'May 05', current: 150, predicted: 135 },
  { date: 'May 08', current: 110, predicted: 98 },
];

const statCards = [
  { title: 'Total Cases', value: '4,46,40,738', trend: '+2.4% vs yesterday', icon: Activity, color: 'emerald' },
  { title: 'Current Deaths', value: '247', trend: '-1.2% vs yesterday', icon: Skull, color: 'rose' },
  { title: 'Active Cases', value: '0', trend: '+0.0% stable', icon: HeartPulse, color: 'blue' },
  { title: 'Recovery Rate', value: '70%', trend: '+3.8%', icon: TrendingUp, color: 'violet' },
  { title: 'High Risk Regions', value: '12', trend: '+2 new', icon: ShieldAlert, color: 'amber' },
];

const colorMap = {
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  rose: 'bg-rose-50 text-rose-600 border-rose-200',
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  violet: 'bg-violet-50 text-violet-600 border-violet-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
};

export default function DoctorDashboard() {
  const motionContainer = useMemo(() => ({
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  }), []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white grid place-items-center shadow-soft">
            <Globe size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-800">
              Global Health Surveillance
            </h1>
            <p className="text-sm text-slate-500">Real-time epidemic monitoring with AI-powered intelligence</p>
          </div>
          <span className="ml-auto text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-medium flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE 24/7
          </span>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={motionContainer} initial="hidden" animate="show" className="grid sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl border border-emerald-100/50 shadow-card p-4 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">{card.title}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1.5">{card.value}</p>
                  <p className={`text-xs mt-1 font-medium ${card.trend.startsWith('+') ? 'text-emerald-500' : card.trend.startsWith('-') ? 'text-rose-500' : 'text-slate-400'}`}>{card.trend}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl border grid place-items-center ${colorMap[card.color]}`}>
                  <Icon size={18} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid xl:grid-cols-[2fr_1fr_300px] gap-4">
        <TrendChart data={trendData} />
        <DonutChart data={diseaseData} />
        <Alerts />
      </div>

      {/* Charts Row 2 */}
      <div className="grid xl:grid-cols-[1fr_1fr_1.2fr_320px] gap-4">
        <AgeBarChart data={ageData} />
        <PredictionChart data={predictionData} />
        <RiskMap />
        <AIInsights />
      </div>

      {/* Bottom Row */}
      <div className="grid xl:grid-cols-3 gap-4">
        <LiveFeed />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="xl:col-span-2 bg-white rounded-2xl border border-emerald-100/50 shadow-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} className="text-emerald-500" />
            <h3 className="font-semibold text-slate-800">Scenario Compare (A vs B)</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope size={14} className="text-emerald-600" />
                <p className="text-xs font-semibold text-emerald-700">Scenario A: Standard Protocol</p>
              </div>
              <p className="text-2xl font-bold text-slate-800">-12%</p>
              <p className="text-xs text-slate-500 mt-1">Projected case reduction in 14 days</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-violet-600" />
                <p className="text-xs font-semibold text-violet-700">Scenario B: Aggressive Response</p>
              </div>
              <p className="text-2xl font-bold text-slate-800">-28%</p>
              <p className="text-xs text-slate-500 mt-1">Projected case reduction in 14 days</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
