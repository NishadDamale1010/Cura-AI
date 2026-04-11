import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// Gradient definitions for enhanced visuals
const GRADIENT_COLORS = [
  { id: 'grad0', start: '#3b82f6', end: '#1e3a8a' },
  { id: 'grad1', start: '#f472b6', end: '#be123c' },
  { id: 'grad2', start: '#eab308', end: '#a16207' },
  { id: 'grad3', start: '#34d399', end: '#065f46' },
  { id: 'grad4', start: '#a78bfa', end: '#5e21b6' },
];

const COLORS = GRADIENT_COLORS.map(g => g.start);

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

export default function DonutChart({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100/50 shadow-card p-4">
      <h3 className="font-semibold text-slate-800 mb-3">Disease Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <GradientDefs />
            <Pie data={data} dataKey="value" innerRadius={58} outerRadius={92} paddingAngle={3}>
              {data.map((entry, i) => (
                <Cell 
                  key={entry.name} 
                  fill={`url(#${GRADIENT_COLORS[i % GRADIENT_COLORS.length].id})`}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center -mt-28 mb-16">
        <span className="text-3xl font-bold dashboard-text">4,46,40,738</span>
      </p>
    </div>
  );
}
