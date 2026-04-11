import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function TrendChart({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100/50 shadow-card p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-slate-800">Real-time Case Trend</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-medium">Live</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer>
          <LineChart data={data}>
            <defs>
              <linearGradient id="lineA" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.15)" strokeDasharray="4 4" />
            <XAxis dataKey="time" stroke="rgba(148,163,184,0.6)" />
            <YAxis stroke="rgba(148,163,184,0.6)" />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, border: '1px solid #d1fae5', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} />
            <Line type="monotone" dataKey="newCases" stroke="url(#lineA)" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="totalCases" stroke="#60a5fa" strokeWidth={2.2} dot={false} strokeDasharray="6 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
