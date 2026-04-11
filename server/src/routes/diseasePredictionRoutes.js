const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

const AI_BASE = process.env.AI_SERVICE_URL
  ? process.env.AI_SERVICE_URL.replace(/\/predict$/, '')
  : 'http://127.0.0.1:8000';

router.post('/heart', auth(['doctor', 'patient']), async (req, res) => {
  try {
    const { data } = await axios.post(`${AI_BASE}/predict/heart`, req.body, { timeout: 10000 });
    return res.json(data);
  } catch (error) {
    const msg = error.response?.data?.detail || error.message;
    return res.status(error.response?.status || 500).json({ message: 'Heart prediction failed', error: msg });
  }
});

router.post('/diabetes', auth(['doctor', 'patient']), async (req, res) => {
  try {
    const { data } = await axios.post(`${AI_BASE}/predict/diabetes`, req.body, { timeout: 10000 });
    return res.json(data);
  } catch (error) {
    const msg = error.response?.data?.detail || error.message;
    return res.status(error.response?.status || 500).json({ message: 'Diabetes prediction failed', error: msg });
  }
});

router.post('/parkinsons', auth(['doctor', 'patient']), async (req, res) => {
  try {
    const { data } = await axios.post(`${AI_BASE}/predict/parkinsons`, req.body, { timeout: 10000 });
    return res.json(data);
  } catch (error) {
    const msg = error.response?.data?.detail || error.message;
    return res.status(error.response?.status || 500).json({ message: "Parkinson's prediction failed", error: msg });
  }
});

router.get('/models/status', auth(['doctor', 'patient']), async (req, res) => {
  try {
    const { data } = await axios.get(`${AI_BASE}/models/status`, { timeout: 6000 });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch model status', error: error.message });
  }
});

module.exports = router;
