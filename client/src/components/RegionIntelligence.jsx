import { motion } from 'framer-motion';
import { Activity, Baby, Users } from 'lucide-react';

export default function RegionIntelligence({ selectedRegion, geoAlert }) {
  if (!selectedRegion) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card"
      >
        <h3 className="mb-4 text-lg font-semibold">Selected Region Intelligence</h3>
        <div className="flex-center py-8">
          <p className="text-sm opacity-60">Select a region marker to inspect details.</p>
        </div>
      </motion.div>
    );
  }

  const riskColors = {
    high: 'from-rose-500 to-red-600',
    medium: 'from-amber-500 to-orange-600',
    low: 'from-emerald-500 to-green-600',
  };

  const riskBg = {
    high: 'bg-rose-500/10 border-rose-500/30',
    medium: 'bg-amber-500/10 border-amber-500/30',
    low: 'bg-emerald-500/10 border-emerald-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card"
    >
      <h3 className="mb-4 text-lg font-semibold">Selected Region Intelligence</h3>

      <div className="space-y-3">
        {/* Main Region Card */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className={`rounded-xl border p-4 ${riskBg[selectedRegion.riskLevel]}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-lg">{selectedRegion.region}</p>
              <div className="mt-2 space-y-1 text-sm">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Risk Score: <span className="font-bold">{selectedRegion.riskScore}</span>
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="flex items-center gap-1">
                    <Activity size={14} />
                    Active Cases: <span className="font-bold">{(selectedRegion.activeCases || 0).toLocaleString()}</span>
                  </span>
                </motion.p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`text-sm font-bold px-3 py-1 rounded-full uppercase`}
              style={{
                background: `linear-gradient(135deg, ${riskColors[selectedRegion.riskLevel]})`,
                color: 'white',
              }}
            >
              {selectedRegion.riskLevel}
            </motion.div>
          </div>
        </motion.div>

        {/* Environmental Data */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg border p-3 bg-blue-500/10 border-blue-500/30 text-sm space-y-1"
        >
          <p className="font-semibold text-blue-300">Environmental Factors</p>
          <div className="space-y-1 text-xs text-blue-200">
            <p>Humidity: {selectedRegion.humidity ?? 'N/A'}%</p>
            <p>AQI: {selectedRegion.aqi ?? 'N/A'}</p>
            <p>Temperature: {selectedRegion.temperature ?? 'N/A'}°C</p>
          </div>
        </motion.div>

        {/* Geo Alert */}
        {geoAlert ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-lg border p-3 bg-rose-500/10 border-rose-500/30"
          >
            <p className="font-semibold text-rose-300 text-sm">⚠️ Geo Alert</p>
            <p className="text-xs text-rose-200 mt-1">{geoAlert.disease} detected in {geoAlert.region}.</p>
            <p className="text-xs text-rose-300/60 mt-1">{new Date(geoAlert.timestamp).toLocaleString()}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-lg border p-3 bg-emerald-500/10 border-emerald-500/30"
          >
            <p className="text-xs text-emerald-300">✓ No region-specific alerts currently mapped.</p>
          </motion.div>
        )}

        {/* Demographic Info */}
        {selectedRegion.population && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-lg border p-3 bg-purple-500/10 border-purple-500/30 text-xs space-y-1"
          >
            <p className="font-semibold text-purple-300">Population Metrics</p>
            <div className="space-y-1 text-purple-200">
              <p className="flex items-center gap-1">
                <Users size={12} /> Total: {(selectedRegion.population || 0).toLocaleString()}
              </p>
              {selectedRegion.childrenPercentage && (
                <p className="flex items-center gap-1">
                  <Baby size={12} /> Children: {selectedRegion.childrenPercentage}%
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
