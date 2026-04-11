const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

function toNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function contains(symptoms, term) {
  return (symptoms || []).some((s) => String(typeof s === 'string' ? s : s?.name || '').toLowerCase().includes(term));
}

function clamp(x, min = 0, max = 1) {
  return Math.min(max, Math.max(min, x));
}

function buildHeartPrediction(payload) {
  const age = toNum(payload?.age ?? payload?.personalDetails?.age, 35);
  const heartRate = toNum(payload?.heartRate ?? payload?.vitals?.heartRate, 78);
  const spo2 = toNum(payload?.spo2 ?? payload?.vitals?.spo2, 97);
  const bp = toNum(payload?.systolic ?? payload?.bpSystolic, 120);
  const cholesterol = toNum(payload?.cholesterol, 180);
  const symptoms = payload?.symptoms || [];

  const chestPain = contains(symptoms, 'chest') ? 0.24 : 0;
  const breath = contains(symptoms, 'breath') ? 0.16 : 0;
  const fatigue = contains(symptoms, 'fatigue') ? 0.08 : 0;

  const risk = clamp(
    0.08
    + (age > 60 ? 0.22 : age > 45 ? 0.13 : 0.05)
    + (heartRate > 115 ? 0.2 : heartRate > 95 ? 0.1 : 0)
    + (spo2 < 92 ? 0.17 : spo2 < 95 ? 0.09 : 0)
    + (bp > 150 ? 0.16 : bp > 130 ? 0.07 : 0)
    + (cholesterol > 240 ? 0.1 : cholesterol > 200 ? 0.05 : 0)
    + chestPain + breath + fatigue,
    0,
    0.98
  );

  return {
    disease: 'heart',
    probability: Number(risk.toFixed(3)),
    risk: risk >= 0.75 ? 'High' : risk >= 0.5 ? 'Medium' : 'Low',
    confidence: Math.round(72 + risk * 22),
    explanation: 'Estimated from vitals + symptom-based cardiovascular risk factors.',
    recommendations: risk >= 0.75
      ? ['Seek urgent cardiology evaluation', 'Get ECG and troponin tests']
      : ['Track heart rate and BP daily', 'Follow low-sodium and low-fat diet'],
  };
}

router.post('/:type', auth(['doctor', 'patient']), (req, res) => {
  try {
    const type = String(req.params.type || '').toLowerCase();
    if (type === 'heart' || type === 'cardio' || type === 'cardiac') {
      return res.status(200).json(buildHeartPrediction(req.body || {}));
    }

    return res.status(400).json({ message: `Unsupported disease prediction type: ${type}` });
  } catch (error) {
    return res.status(500).json({ message: 'Disease prediction failed', error: error.message });
  }
});

module.exports = router;
