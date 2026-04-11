const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  const fileName = req.body?.file_name || 'uploaded-report.pdf';

  return res.status(200).json({
    patient_name: 'John Doe',
    age: 45,
    metrics: {
      blood_pressure: '150/95',
      glucose: 180,
      source_file: fileName,
    },
    risk_score: 72,
    conditions: ['Hypertension Risk'],
    recommendations: [
      'Reduce salt intake',
      'Exercise regularly',
      'Consult a physician',
    ],
  });
});

module.exports = router;
