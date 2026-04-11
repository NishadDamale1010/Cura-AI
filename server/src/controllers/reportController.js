const path = require('path');
const MedicalReport = require('../models/MedicalReport');
const DoctorMonthlyReport = require('../models/DoctorMonthlyReport');

const toBool = (value) => String(value).toLowerCase() === 'true';

exports.uploadPatientReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Report file is required' });

    const fileUrl = `/uploads/${path.basename(req.file.path)}`;
    const payload = {
      patientId: req.user.id,
      uploadedBy: req.user.id,
      fileUrl,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      notes: req.body.notes || '',
      tags: (req.body.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      clinicalFlags: {
        highFever: toBool(req.body.highFever),
        lowSpo2: toBool(req.body.lowSpo2),
        respiratoryDistress: toBool(req.body.respiratoryDistress),
      },
    };

    const created = await MedicalReport.create(payload);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to upload medical report', error: error.message });
  }
};

exports.getMyReports = async (req, res) => {
  try {
    const query = req.user.role === 'patient' ? { patientId: req.user.id } : {};
    const reports = await MedicalReport.find(query)
      .populate('patientId', 'name email')
      .sort({ createdAt: -1 })
      .limit(200);

    const monthlyReports = await DoctorMonthlyReport.find(
      req.user.role === 'doctor' ? { doctorId: req.user.id } : {}
    )
      .sort({ month: -1, createdAt: -1 })
      .limit(120);

    return res.status(200).json({ reports, monthlyReports });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
};

exports.createOrUpdateMonthlyReport = async (req, res) => {
  try {
    const { month, region, summary, totalCasesReviewed, highRiskCount, dominantDisease, recommendations = [] } = req.body;

    if (!month || !region || !summary) {
      return res.status(400).json({ message: 'month, region and summary are required' });
    }

    const doc = await DoctorMonthlyReport.findOneAndUpdate(
      { doctorId: req.user.id, month, region },
      {
        $set: {
          summary,
          totalCasesReviewed: Number(totalCasesReviewed || 0),
          highRiskCount: Number(highRiskCount || 0),
          dominantDisease: dominantDisease || '',
          recommendations: Array.isArray(recommendations)
            ? recommendations.filter(Boolean)
            : String(recommendations)
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json(doc);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save monthly report', error: error.message });
  }
};


exports.analyzeReport = async (req, res) => {
  try {
    const { reportText = '', tags = [], highFever = false, lowSpo2 = false, respiratoryDistress = false } = req.body || {};

    const normalized = String(reportText).toLowerCase();
    const findings = [];

    if (highFever || /fever|pyrexia/.test(normalized)) findings.push('High fever markers detected.');
    if (lowSpo2 || /spo2|oxygen|hypoxia/.test(normalized)) findings.push('Possible oxygen desaturation risk.');
    if (respiratoryDistress || /wheez|breath|respirat/.test(normalized)) findings.push('Respiratory stress indicators present.');
    if (/platelet/.test(normalized)) findings.push('Platelet mention detected; monitor for dengue/viral risk.');

    const riskScore = Math.min(100, 20
      + (findings.length * 15)
      + (Array.isArray(tags) ? tags.length * 5 : 0)
      + (highFever ? 10 : 0)
      + (lowSpo2 ? 20 : 0)
      + (respiratoryDistress ? 15 : 0));

    const riskLevel = riskScore >= 70 ? 'High' : riskScore >= 45 ? 'Moderate' : 'Low';

    const actions = [
      riskScore >= 70 ? 'Escalate to physician review within 6 hours.' : 'Continue monitoring and schedule doctor follow-up.',
      'Correlate report findings with local outbreak trend dashboard.',
      'Push personalized precautions to patient app.',
    ];

    return res.status(200).json({
      riskScore,
      riskLevel,
      findings,
      actions,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to analyze report', error: error.message });
  }
};
