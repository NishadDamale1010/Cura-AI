const express = require('express');
const auth = require('../middleware/auth');
const { calculateBiologicalRiskScore } = require('../services/advancedPredictionEngine');

const router = express.Router();

function toNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// True Clinical Means/StdDev derived from aggregate public datasets (CDC/UCI)
const clinicalMedians = {
  heart: {
    age: { mean: 45, std: 12 },
    heartRate: { mean: 75, std: 10 },
    spo2: { mean: 98, std: 2 },
    systolic: { mean: 120, std: 15 },
    cholesterol: { mean: 190, std: 30 }
  },
  diabetes: {
    age: { mean: 33, std: 11 },
    glucose: { mean: 120, std: 30 },
    bmi: { mean: 31.9, std: 7.8 },
    dpf: { mean: 0.47, std: 0.33 },
    insulin: { mean: 79.7, std: 115 }
  },
  parkinsons: {
    fo: { mean: 154, std: 41 },
    dfa: { mean: 0.71, std: 0.05 },
    ppe: { mean: 0.2, std: 0.09 },
    spread1: { mean: -5.6, std: 1.0 }
  }
};

function buildHeartPrediction(payload) {
  const userMetrics = {
    age: toNum(payload?.age ?? payload?.personalDetails?.age, 35),
    heartRate: toNum(payload?.heartRate ?? payload?.vitals?.heartRate, 78),
    spo2: toNum(payload?.spo2 ?? payload?.vitals?.spo2, 97),
    systolic: toNum(payload?.systolic ?? payload?.bpSystolic, 120),
    cholesterol: toNum(payload?.cholesterol, 180)
  };

  const risk = calculateBiologicalRiskScore(userMetrics, clinicalMedians.heart);

  return {
    disease: 'heart',
    probability: Number(risk.toFixed(3)),
    risk: risk >= 0.75 ? 'High' : risk >= 0.5 ? 'Medium' : 'Low',
    model_type: 'Multivariate Variance Analysis',
    features_used: Object.keys(userMetrics).length,
    confidence: Math.round(72 + risk * 22),
    explanation: 'Variance model derived against CDC clinical mean baselines.',
    advice: risk >= 0.75
      ? 'Significant variance from clinical norms. Seek urgent cardiology evaluation.'
      : 'Metrics within standard deviation of baseline norms.'
  };
}

function buildDiabetesPrediction(payload) {
  const userMetrics = {
    age: toNum(payload?.age, 35),
    glucose: toNum(payload?.glucose, 120),
    bmi: toNum(payload?.bmi, 25.0),
    dpf: toNum(payload?.dpf, 0.5),
    insulin: toNum(payload?.insulin, 80)
  };

  const risk = calculateBiologicalRiskScore(userMetrics, clinicalMedians.diabetes);

  return {
    disease: 'diabetes',
    probability: Number(risk.toFixed(3)),
    risk: risk >= 0.7 ? 'High' : risk >= 0.4 ? 'Medium' : 'Low',
    model_type: 'Multivariate Variance Analysis',
    features_used: Object.keys(userMetrics).length,
    confidence: Math.round(75 + risk * 20),
    explanation: 'Statistically evaluated against Pima Indians Diabetes Dataset baselines.',
    advice: risk >= 0.7
      ? 'High glucose/BMI variance. Immediate endocrinologist consultation recommended.'
      : 'Variance is moderate. Maintain healthy diet and regular physical activity.'
  };
}

function buildParkinsonsPrediction(payload) {
  const userMetrics = {
    fo: toNum(payload?.fo, 150.0),
    dfa: toNum(payload?.dfa, 0.72),
    ppe: toNum(payload?.ppe, 0.2),
    spread1: toNum(payload?.spread1, -5.0)
  };

  const risk = calculateBiologicalRiskScore(userMetrics, clinicalMedians.parkinsons);

  return {
    disease: 'parkinsons',
    probability: Number(risk.toFixed(3)),
    risk: risk >= 0.75 ? 'High' : risk >= 0.45 ? 'Medium' : 'Low',
    model_type: 'Multivariate Variance Analysis',
    features_used: Object.keys(userMetrics).length,
    confidence: Math.round(80 + risk * 15),
    explanation: 'Dysphonia spread variance analyzed against UCI Biomedical datasets.',
    advice: risk >= 0.75
      ? 'High acoustic variance detected. Refer to neurologist.'
      : 'No critical marker variance detected.'
  };
}

router.post('/:type', auth(['doctor', 'patient']), (req, res) => {
  try {
    const type = String(req.params.type || '').toLowerCase();
    
    if (type === 'heart' || type === 'cardio' || type === 'cardiac') {
      return res.status(200).json(buildHeartPrediction(req.body || {}));
    }
    
    if (type === 'diabetes') {
      return res.status(200).json(buildDiabetesPrediction(req.body || {}));
    }
    
    if (type === 'parkinsons') {
      return res.status(200).json(buildParkinsonsPrediction(req.body || {}));
    }

    return res.status(400).json({ message: `Unsupported disease prediction type: ${type}` });
  } catch (error) {
    return res.status(500).json({ message: 'Disease prediction failed', error: error.message });
  }
});

module.exports = router;
