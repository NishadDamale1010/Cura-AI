export default function LiveFeed() {
  const items = [
    { title: 'New cluster detected', place: 'Bengaluru, Karnataka', age: '2m' },
    { title: 'Cases declining', place: 'Chennai, Tamil Nadu', age: '6m' },
    { title: 'High recovery rate', place: 'Kerala', age: '15m' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-emerald-100/50 shadow-card p-4">
      <h3 className="font-semibold text-slate-800 mb-3">Live Feed</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.title} className="flex items-center justify-between rounded-xl border border-emerald-100/60 bg-emerald-50/20 p-3 hover:bg-emerald-50/40 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-700">{item.title}</p>
              <p className="text-xs text-slate-500">{item.place}</p>
            </div>
            <p className="text-xs text-slate-400">{item.age}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
