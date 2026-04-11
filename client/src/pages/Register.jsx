import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Mail, Lock, ArrowRight, Stethoscope, HeartPulse, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ROLES = [
  { key: 'patient', label: 'Patient', icon: HeartPulse, desc: 'Monitor your health & get AI insights', gradient: 'from-cyan-500 to-blue-500' },
  { key: 'doctor', label: 'Doctor', icon: Stethoscope, desc: 'Manage patients & surveillance data', gradient: 'from-violet-500 to-purple-500' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to CuraAI.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = ROLES.find((r) => r.key === form.role);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 -z-10" />
      <div className="absolute top-[-20%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-violet-500/10 blur-[120px] animate-blob" />
      <div className="absolute bottom-[-15%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-cyan-500/10 blur-[100px] animate-blob" style={{ animationDelay: '4s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 grid place-items-center shadow-glow-cyan">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <span className="text-xl font-black font-display text-white">Cura<span className="text-cyan-400">AI</span></span>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-violet-400" />
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest font-display">New Account</span>
            </div>
            <h1 className="text-3xl font-black font-display text-white">Create account</h1>
            <p className="text-slate-400 text-sm mt-1">Join the AI-powered health intelligence platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 font-display mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const active = form.role === role.key;
                  return (
                    <button key={role.key} type="button"
                      onClick={() => setForm({ ...form, role: role.key })}
                      className={`relative flex flex-col items-start gap-1.5 p-4 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden
                        ${active ? 'border-cyan-400/70 bg-white/15 shadow-glow-cyan' : 'border-white/15 bg-white/5 hover:bg-white/10'}`}>
                      {active && (
                        <motion.div layoutId="roleGlow" className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-10 rounded-2xl`} />
                      )}
                      <div className={`h-9 w-9 rounded-xl grid place-items-center bg-gradient-to-br ${role.gradient} shadow-sm`}>
                        <Icon size={18} className="text-white" />
                      </div>
                      <span className={`text-sm font-bold font-display ${active ? 'text-white' : 'text-slate-300'}`}>{role.label}</span>
                      <span className="text-[10px] text-slate-500 leading-tight">{role.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-300 font-display">Full Name</label>
              <div className="relative group">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-white/15 focus:ring-4 focus:ring-cyan-500/15"
                  placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-300 font-display">Email Address</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input type="email" className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-white/15 focus:ring-4 focus:ring-cyan-500/15"
                  placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-300 font-display">Password</label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input type={showPass ? 'text' : 'password'}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-12 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-white/15 focus:ring-4 focus:ring-cyan-500/15"
                  placeholder="Min. 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm font-display overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed group transition-all duration-300 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-glow-cyan hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating account...
                  </motion.span>
                ) : (
                  <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    Create account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">Sign in →</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
