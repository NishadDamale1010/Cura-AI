const express = require('express');
const auth = require('../middleware/auth');
const {
  getDataset,
  getStats,
  getRegions,
  getAlerts,
  getTrends,
} = require('../controllers/surveillanceController');

const router = express.Router();

router.get('/dataset', auth(['doctor', 'patient']), getDataset);
router.get('/stats', auth(['doctor', 'patient']), getStats);
router.get('/regions', auth(['doctor', 'patient']), getRegions);
router.get('/alerts', auth(['doctor', 'patient']), getAlerts);
router.get('/trends', auth(['doctor', 'patient']), getTrends);

module.exports = router;
