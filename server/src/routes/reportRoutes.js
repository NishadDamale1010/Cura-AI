const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadPatientReport,
  getMyReports,
  createOrUpdateMonthlyReport,
  analyzeReport,
} = require('../controllers/reportController');

const router = express.Router();

router.get('/mine', auth(['doctor', 'patient']), getMyReports);
router.post('/patient/upload', auth(['patient']), upload.single('file'), uploadPatientReport);
router.post('/doctor/monthly', auth(['doctor']), createOrUpdateMonthlyReport);
router.post('/analyze', auth(['doctor', 'patient']), analyzeReport);

module.exports = router;
