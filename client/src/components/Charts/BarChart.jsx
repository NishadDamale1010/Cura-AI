import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function AnimatedBarChart({ data, title, height = 250, color = '#818cf8' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card"
    >
      <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
        <motion.div
          className={`w-3 h-3 rounded-full bg-gradient-to-r ${
            color.includes('f59e0b')
              ? 'from-amber-500 to-orange-600'
              : 'from-indigo-500 to-purple-600'
          }`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {title}
      </h3>

      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={color} stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="ageGroup"
              stroke="rgba(255, 255, 255, 0.5)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.5)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(129, 140, 248, 0.3)',
                borderRadius: '8px',
                boxShadow: '0 0 20px rgba(129, 140, 248, 0.3)',
              }}
              cursor={{ fill: 'rgba(129, 140, 248, 0.2)' }}
            />
            <Bar
              dataKey="riskIndex"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
              isAnimationActive
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
