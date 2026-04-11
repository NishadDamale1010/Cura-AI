import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Shield, Brain, Zap, ArrowRight, HeartPulse, ShieldAlert, FileText } from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Navigation */}
      <nav className="absolute top-0 w-full p-6 z-50 flex items-center justify-between max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 grid place-items-center text-white shadow-lg">
            <Activity size={24} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700">
            CuraAI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-600 hover:text-cyan-600 font-semibold px-4 py-2 transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-amber-200/40 blur-[100px] rounded-full mix-blend-multiply" />
          <div className="absolute top-40 -left-40 w-[600px] h-[600px] bg-cyan-200/40 blur-[120px] rounded-full mix-blend-multiply" />
          <div className="absolute -bottom-40 right-20 w-[500px] h-[500px] bg-violet-200/40 blur-[100px] rounded-full mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md text-sm font-semibold text-cyan-600 mb-8">
              <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              Next-Gen Health Surveillance
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-800 tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto"
          >
            Predict. Prevent. <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600">
              Protect Lives with AI.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            CuraAI is a revolutionary disease outbreak prediction and personal health surveillance system. Harnessing the power of AI to forecast risks before they become emergencies.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group">
              Start Free Today
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2">
              <Shield size={20} className="text-cyan-500" />
              Authority Access
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="h-14 w-14 rounded-2xl bg-cyan-100 text-cyan-600 grid place-items-center mb-6">
              <Brain size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">AI Disease Prediction</h3>
            <p className="text-slate-600 leading-relaxed">
              Utilize trained SVM and Deep Learning models across vast clinical datasets to predict individual risk factors with over 85% accuracy.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="h-14 w-14 rounded-2xl bg-amber-100 text-amber-600 grid place-items-center mb-6">
              <ShieldAlert size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Outbreak Forensics</h3>
            <p className="text-slate-600 leading-relaxed">
              Real-time epidemic monitoring. Detect anomalies in local health regions, track environmental vectors, and forecast outbreaks ahead of time.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="h-14 w-14 rounded-2xl bg-violet-100 text-violet-600 grid place-items-center mb-6">
              <HeartPulse size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Patient Health Tracker</h3>
            <p className="text-slate-600 leading-relaxed">
              Log daily vitals, get smart AI-driven advice, and maintain a historical record of your health status linked securely to health authorities.
            </p>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}
