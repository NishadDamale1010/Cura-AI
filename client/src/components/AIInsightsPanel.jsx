import { motion } from 'framer-motion';
import {
  Zap,
  AlertCircle,
  TrendingUp,
  Shield,
} from 'lucide-react';

const insightIcons = {
  trend: TrendingUp,
  alert: AlertCircle,
  prediction: Zap,
  risk: Shield,
};

export default function AIInsightsPanel({ insights = [], predictions = [] }) {
  const displayInsights = insights.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card"
    >
      <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
        <motion.div
          className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
        AI Insights & Predictions
      </h3>

      <div className="space-y-2">
        {displayInsights.map((insight, idx) => {
          const IconComponent = insightIcons[insight.type] || Zap;
          return (
            <motion.div
              key={`${insight.type}-${idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ x: 5 }}
              className="rounded-xl border p-3 bg-blue-500/10 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="flex gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-blue-400 flex-shrink-0 mt-0.5"
                >
                  <IconComponent size={18} />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-blue-300 line-clamp-2">{insight.message}</p>
                  <p className="text-xs text-blue-400/70 mt-1">
                    Confidence: {insight.confidence}%
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {displayInsights.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm opacity-60">No insights available yet.</p>
          </div>
        )}

        {predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-lg border p-3 bg-emerald-500/10 border-emerald-500/30 mt-2"
          >
            <p className="text-xs font-semibold text-emerald-400">
              Prediction Coverage
            </p>
            <p className="text-xs text-emerald-300/70 mt-1">
              {predictions.length} regions · Model confidence: 94.2%
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
