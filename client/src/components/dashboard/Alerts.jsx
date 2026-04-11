const toneMap = {
  Critical: 'border-rose-200 bg-rose-50 text-rose-700',
  Warning: 'border-amber-200 bg-amber-50 text-amber-700',
  Info: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export default function Alerts() {
  const alerts = [
    { title: 'High Risk Zone Detected', severity: 'Critical', location: 'Mumbai, India · 2 min ago' },
    { title: 'Unusual Pattern Detected', severity: 'Warning', location: 'Delhi, India · 5 min ago' },
    { title: 'Resource Low', severity: 'Info', location: 'Andhra Pradesh · 12 min ago' },
  ];

  return (
    <aside className="bg-white rounded-2xl border border-emerald-100/50 shadow-card p-4">
      <h3 className="font-semibold text-slate-800 mb-3">Live Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <article key={alert.title} className={`rounded-xl border p-3 ${toneMap[alert.severity]}`}>
            <p className="font-semibold text-sm">{alert.title}</p>
            <p className="text-xs opacity-80 mt-1">{alert.location}</p>
            <p className="text-xs mt-2 font-medium">{alert.severity}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}
