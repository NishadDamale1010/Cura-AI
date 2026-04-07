import { Link, useLocation } from 'react-router-dom';
import { Activity, AlertTriangle, ClipboardList, Map, MessageCircle, PlusCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const doctorNav = [
  { to: '/doctor/dashboard', label: 'Dashboard', icon: Activity },
  { to: '/doctor/reports', label: 'Reports', icon: ClipboardList },
  { to: '/doctor/alerts', label: 'Alerts', icon: AlertTriangle },
  { to: '/doctor/map', label: 'Outbreak Map', icon: Map },
];

const patientNav = [
  { to: '/patient/dashboard', label: 'My Dashboard', icon: Activity },
  { to: '/patient/submit', label: 'Submit Symptoms', icon: PlusCircle },
  { to: '/patient/nearby', label: 'Nearby Risk', icon: Map },
];

export default function Layout({ children, darkMode, onToggleDarkMode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const nav = user?.role === 'doctor' ? doctorNav : patientNav;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 dark:text-slate-100 md:flex">
        <aside className="w-full md:w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white grid place-items-center"><ShieldCheck /></div>
              <div>
                <h1 className="text-2xl font-bold">Cura</h1>
                <p className="text-sm text-slate-500 dark:text-slate-300">AI Disease Surveillance</p>
              </div>
            </div>
          </div>
          <nav className="p-3 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${active ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                  <Icon size={18} /> {item.label}
                </Link>
              );
            })}
            <Link to="/chat" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><MessageCircle size={18} /> AI Chatbot</Link>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 space-y-4">
          <div className="card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <input className="w-full md:max-w-xl rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 px-3 py-2" placeholder="Search diseases, regions, alerts..." />
            <div className="flex gap-2 items-center text-sm">
              <button className="px-3 py-2 rounded-lg border" onClick={onToggleDarkMode}>{darkMode ? 'Light' : 'Dark'} Mode</button>
              <div className="text-right">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-slate-500 dark:text-slate-300 capitalize">{user?.role}</p>
              </div>
              <button className="px-3 py-2 rounded-lg border" onClick={logout}>Logout</button>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
