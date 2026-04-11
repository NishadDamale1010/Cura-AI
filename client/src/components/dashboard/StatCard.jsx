import { motion } from 'framer-motion';

export default function StatCard({ title, value, trend, icon: Icon, ring = false }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-2xl border border-emerald-100/50 shadow-card p-4 min-h-28 hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
          <p className={`text-xs mt-1 font-medium ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{trend}</p>
        </div>
        {ring ? (
          <div className="h-14 w-14 rounded-full border-[6px] border-emerald-200 border-t-emerald-500" />
        ) : (
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white grid place-items-center shadow-soft">
            <Icon size={18} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
