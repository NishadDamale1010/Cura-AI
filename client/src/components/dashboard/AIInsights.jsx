export default function AIInsights() {
  const insights = [
    { text: '↑ 23% spike in southern zones compared to last week', color: 'rose' },
    { text: '5 new clusters likely in Bengaluru, Pune, Hyderabad', color: 'amber' },
    { text: 'Resource optimization can improve recovery by 8%', color: 'emerald' },
  ];

  const colorMap = {
    rose: 'border-rose-200 bg-rose-50/50',
    amber: 'border-amber-200 bg-amber-50/50',
    emerald: 'border-emerald-200 bg-emerald-50/50',
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100/50 shadow-card p-4">
      <h3 className="font-semibold text-slate-800 mb-3">AI Insights</h3>
      <div className="space-y-3">
        {insights.map((item) => (
          <div key={item.text} className={`rounded-xl border p-3 hover:-translate-y-0.5 transition duration-300 ${colorMap[item.color]}`}>
            <p className="text-sm text-slate-700">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
