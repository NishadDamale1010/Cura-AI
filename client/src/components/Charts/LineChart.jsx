import { motion } from 'framer-motion';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function AnimatedLineChart({ data, title, colors = ['#818cf8', '#06d6a0'], height = 300 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card"
    >
      <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
        <motion.div
          className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {title}
      </h3>

      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorGradient1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorGradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[1]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors[1]} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
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
              cursor={{
                stroke: 'rgba(129, 140, 248, 0.5)',
                strokeWidth: 2,
              }}
            />
            <Legend wrapperStyle={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            <Line
              type="monotone"
              dataKey="newCases"
              stroke={colors[0]}
              strokeWidth={2}
              dot={false}
              isAnimationActive
              name="New Cases"
            />
            <Line
              type="monotone"
              dataKey="totalCases"
              stroke={colors[1]}
              strokeWidth={2}
              dot={false}
              isAnimationActive
              name="Total Cases"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
