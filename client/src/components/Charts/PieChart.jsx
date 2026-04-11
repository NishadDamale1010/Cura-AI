import { motion } from 'framer-motion';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

// Gradient definitions for enhanced visuals
const GRADIENT_COLORS = [
  { id: 'gradRed', start: '#ef4444', end: '#7f1d1d' },
  { id: 'gradAmber', start: '#f59e0b', end: '#92400e' },
  { id: 'gradGreen', start: '#22c55e', end: '#15803d' },
  { id: 'gradBlue', start: '#3b82f6', end: '#1e3a8a' },
  { id: 'gradPurple', start: '#8b5cf6', end: '#4c1d95' },
  { id: 'gradPink', start: '#ec4899', end: '#831843' },
];

// SVG Defs Component for gradients
const GradientDefs = () => (
  <defs>
    {GRADIENT_COLORS.map(gradient => (
      <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={gradient.start} />
        <stop offset="100%" stopColor={gradient.end} />
      </linearGradient>
    ))}
  </defs>
);

export default function AnimatedPieChart({ data, title, height = 300 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card"
    >
      <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
        <motion.div
          className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        {title}
      </h3>

      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer>
          <PieChart>
            <GradientDefs />
            <Pie
              data={data}
              dataKey="cases"
              nameKey="disease"
              outerRadius={90}
              label={({ disease, percent }) =>
                `${disease} ${(percent * 100).toFixed(0)}%`
              }
              isAnimationActive
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#${GRADIENT_COLORS[index % GRADIENT_COLORS.length].id})`}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(129, 140, 148, 0.3)',
                borderRadius: '8px',
                boxShadow: '0 0 20px rgba(129, 140, 148, 0.3)',
              }}
              formatter={(value) => value.toLocaleString()}
            />
            <Legend wrapperStyle={{ color: 'rgba(255, 255, 255, 0.7)' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
