import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/10 blur-[120px] animate-blob" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[100px] animate-blob" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[40%] left-[50%] w-[30vw] h-[30vw] rounded-full bg-blue-500/8 blur-[80px] animate-blob" style={{ animationDelay: '6s' }} />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-14 flex-1 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 grid place-items-center shadow-glow-cyan">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <span className="text-2xl font-black font-display text-white tracking-tight">
            Cura<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">AI</span>
          </span>
        </div>

        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
            <h2 className="text-5xl font-black font-display text-white leading-tight">
              Intelligence for<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
                Better Health
              </span>
            </h2>
            <p className="text-slate-400 text-lg mt-5 leading-relaxed max-w-md">
              AI-powered disease surveillance, outbreak prediction, and real-time health monitoring — all in one platform.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-3 gap-4">
            {[
              { value: '99.2%', label: 'Prediction Accuracy' },
              { value: '12+', label: 'Live Data Sources' },
              { value: '1M+', label: 'Records Analyzed' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-black font-display text-cyan-400">{stat.value}</p>
                <p className="text-xs text-slate-400 font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="text-slate-600 text-sm">© 2025 CuraAI · Secure Health Intelligence Platform</p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:max-w-[480px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Glass Card */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Logo (mobile) */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 grid place-items-center shadow-glow-cyan">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <span className="text-xl font-black font-display text-white">Cura<span className="text-cyan-400">AI</span></span>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-cyan-400" />
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-display">Secure Login</span>
              </div>
              <h1 className="text-3xl font-black font-display text-white">Welcome back</h1>
              <p className="text-slate-400 text-sm mt-1">Sign in to your health intelligence dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-300 font-display">Email Address</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="email"
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-white/15 focus:ring-4 focus:ring-cyan-500/15"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-300 font-display">Password</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-12 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-cyan-400/60 focus:bg-white/15 focus:ring-4 focus:ring-cyan-500/15"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm font-display overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed group transition-all duration-300 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-glow-cyan hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      Sign in <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-slate-400">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                  Create one free →
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
