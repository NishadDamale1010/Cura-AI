export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-emerald-100/50 bg-white shadow-card transition-all duration-300 hover:shadow-card-hover ${className}`}>
      {children}
    </div>
  );
}
