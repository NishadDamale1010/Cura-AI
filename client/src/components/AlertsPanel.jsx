import { motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

function getAlertConfig(level) {
  switch (level) {
    case 'critical':
      return {
        icon: AlertCircle,
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/50',
        text: 'text-rose-400',
        glow: 'shadow-rose-500/20',
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/50',
        text: 'text-amber-400',
        glow: 'shadow-amber-500/20',
      };
    default:
      return {
        icon: Info,
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/50',
        text: 'text-blue-400',
        glow: 'shadow-blue-500/20',
      };
  }
}

export default function AlertCard({ alert, index }) {
  const config = getAlertConfig(alert.severity);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, x: 10 }}
      className={`rounded-lg border p-3 ${config.bg} ${config.border} ${config.glow} cursor-pointer transition-all duration-300`}
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon size={18} className={config.text} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${config.text}`}>
            {alert.disease} · {alert.region}
          </p>
          <p className="text-xs opacity-70 mt-1">{alert.message}</p>
          <p className="text-xs opacity-50 mt-1">
            {new Date(alert.timestamp).toLocaleString()}
          </p>
        </div>
        <motion.div
          className={`text-xs font-bold uppercase px-2 py-1 rounded-full whitespace-nowrap ${config.text}`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {alert.severity}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function AlertsPanel({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card"
      >
        <h3 className="mb-4 text-lg font-semibold">Live Alerts</h3>
        <div className="flex-center py-8">
          <p className="text-sm opacity-60">No active alerts at this time.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card"
    >
      <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
        <motion.div
          className="w-3 h-3 rounded-full bg-rose-500"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        Live Alerts
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
        {alerts.slice(0, 8).map((alert, index) => (
          <AlertCard key={`${alert.region}-${alert.disease}-${index}`} alert={alert} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
