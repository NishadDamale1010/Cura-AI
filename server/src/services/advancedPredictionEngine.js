/**
 * advancedPredictionEngine.js
 * 
 * Replaces fake "clamp" equations with mathematical statistical modeling.
 * Includes Linear Regression, Moving Averages, and Z-Score Anomaly Detection
 * to run against real datasets fetched from WHO / Disease.sh.
 */

/**
 * Calculates a Linear Regression line over a set of Y values.
 * Returns the projected value for the `futureSteps` index.
 */
function linearRegressionProjection(dataSeries, futureSteps = 7) {
  if (!dataSeries || dataSeries.length < 2) return dataSeries[0] || 0;

  const n = dataSeries.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = Number(dataSeries[i]);
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Project future value
  const targetX = n - 1 + futureSteps;
  const projectedValue = slope * targetX + intercept;

  return Math.max(0, projectedValue); // Cannot have negative cases
}

/**
 * Calculates a Simple Moving Average (SMA) of window size.
 */
function movingAverage(dataSeries, window = 7) {
  if (dataSeries.length < window) return dataSeries;
  let result = [];
  for (let i = 0; i <= dataSeries.length - window; i++) {
    const slice = dataSeries.slice(i, i + window);
    const avg = slice.reduce((a, b) => a + Number(b), 0) / window;
    result.push(avg);
  }
  return result;
}

/**
 * Evaluates risk score using real global health metrics compared to an individual.
 */
function calculateBiologicalRiskScore(userMetrics, globalMedians) {
  let varianceScore = 0;
  
  // Calculate Euclidean distance or absolute variance from the global median of normal populations
  for (const [key, value] of Object.entries(userMetrics)) {
    if (globalMedians[key] !== undefined) {
      const normal = globalMedians[key].mean;
      const stdDev = globalMedians[key].std;
      if (stdDev > 0) {
        const zScore = Math.abs((Number(value) - normal) / stdDev);
        varianceScore += zScore; // Accumulate standard deviations away from normal
      }
    }
  }

  // Normalize risk based on number of metrics evaluated
  const keysCount = Object.keys(userMetrics).length || 1;
  const avgZScore = varianceScore / keysCount;

  // Transform average zScore to a pseudo-probability 0.0 -> 1.0 (approximating CDF)
  const riskProbability = Math.min(0.98, Math.max(0.02, 1 - Math.exp(-0.7 * avgZScore)));
  
  return riskProbability;
}

module.exports = {
  linearRegressionProjection,
  movingAverage,
  calculateBiologicalRiskScore
};
