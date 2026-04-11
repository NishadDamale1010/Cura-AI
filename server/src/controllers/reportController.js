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
    const {
      reportText = '',
      tags = [],
      highFever = false,
      lowSpo2 = false,
      respiratoryDistress = false,
      notes = '',
    } = req.body || {};

    const text = (String(reportText) + ' ' + String(notes)).toLowerCase();
    const tagList = Array.isArray(tags) ? tags.map((t) => String(t).toLowerCase()) : [];

    const findings = [];
    let riskScore = 10;

    // Fever signals
    if (highFever || /fever|pyrexia|hyperthermia|high temperature|38\./.test(text)) {
      findings.push({ icon: '🌡️', label: 'Elevated Temperature Markers', detail: 'Fever indicators detected. May signal bacterial or viral infection.', severity: 'high' });
      riskScore += 18;
    }

    // Oxygen saturation
    if (lowSpo2 || /spo2|oxygen saturation|hypoxia|o2.*%|low.*oxygen/.test(text)) {
      findings.push({ icon: '💨', label: 'Oxygen Desaturation Risk', detail: 'SpO2 / hypoxia markers found. Respiratory function may be compromised.', severity: 'high' });
      riskScore += 22;
    }

    // Respiratory
    if (respiratoryDistress || /wheez|shortness of breath|dyspnea|respirat|tachypnea|chest.*tightn/.test(text)) {
      findings.push({ icon: '🫁', label: 'Respiratory Stress Indicators', detail: 'Respiratory distress signals present. Evaluate for pneumonia or bronchitis.', severity: 'high' });
      riskScore += 18;
    }

    // Dengue/platelet
    if (/platelet|dengue|thrombocytopenia|platelet.*low|plt/.test(text)) {
      findings.push({ icon: '🦟', label: 'Possible Vector-Borne Risk', detail: 'Platelet decline detected. Evaluate for Dengue or other vector-borne illness.', severity: 'medium' });
      riskScore += 14;
    }

    // Malaria
    if (/malaria|plasmodium|anemia|hemoglobin.*low/.test(text)) {
      findings.push({ icon: '🔴', label: 'Malaria / Anemia Indicators', detail: 'Haemoglobin / malaria-related terms found in report.', severity: 'medium' });
      riskScore += 12;
    }

    // Infection / WBC
    if (/wbc|white blood cell|leukocytosis|leukopenia|infection|sepsis|bacterial/.test(text)) {
      findings.push({ icon: '🧫', label: 'Inflammatory / Infection Markers', detail: 'WBC count / sepsis indicators found. Possible active systemic infection.', severity: 'medium' });
      riskScore += 12;
    }

    // Cholesterol / Cardiac
    if (/cholesterol|ldl|hdl|triglycerides|cardiac|ecg|troponin|arrhythmia/.test(text)) {
      findings.push({ icon: '❤️', label: 'Cardiovascular Markers', detail: 'Cardiac or lipid markers detected. Recommend lipid panel / cardiology follow-up.', severity: 'medium' });
      riskScore += 8;
    }

    // Blood sugar / Diabetes
    if (/glucose|blood sugar|hba1c|diabetes|hyperglycemia|insulin/.test(text)) {
      findings.push({ icon: '🩸', label: 'Glucose / Diabetes Markers', detail: 'Blood glucose / HbA1c markers found. Endocrinology review recommended.', severity: 'low' });
      riskScore += 8;
    }

    // Liver
    if (/sgpt|sgot|alt|ast|bilirubin|liver|hepatitis|jaundice/.test(text)) {
      findings.push({ icon: '🟡', label: 'Liver Function Markers', detail: 'Elevated liver enzymes or bilirubin detected. Hepatic evaluation recommended.', severity: 'medium' });
      riskScore += 10;
    }

    // Kidney
    if (/creatinine|urea|kidney|renal|egfr|bun/.test(text)) {
      findings.push({ icon: '🫘', label: 'Renal Function Markers', detail: 'Kidney function markers detected. Monitor renal output closely.', severity: 'medium' });
      riskScore += 8;
    }

    // Tag-based boost
    riskScore += Math.min(15, tagList.length * 4);

    riskScore = Math.min(100, Math.max(5, Math.round(riskScore)));

    const riskLevel = riskScore >= 70 ? 'High' : riskScore >= 45 ? 'Moderate' : 'Low';

    // Differential diagnosis hints
    const differentials = [];
    if (findings.some((f) => /dengue|vector/.test(f.label.toLowerCase()))) differentials.push('Dengue Fever');
    if (findings.some((f) => /respiratory/.test(f.label.toLowerCase()))) differentials.push('Acute Respiratory Infection');
    if (findings.some((f) => /malaria|anemia/.test(f.label.toLowerCase()))) differentials.push('Malaria / Anaemia');
    if (findings.some((f) => /cardiac/.test(f.label.toLowerCase()))) differentials.push('Cardiovascular Disease');
    if (findings.some((f) => /glucose|diabetes/.test(f.label.toLowerCase()))) differentials.push('Diabetes Mellitus');
    if (findings.some((f) => /liver/.test(f.label.toLowerCase()))) differentials.push('Hepatic Dysfunction');
    if (findings.some((f) => /renal|kidney/.test(f.label.toLowerCase()))) differentials.push('Chronic Kidney Disease');
    if (findings.some((f) => /infection|bacterial/.test(f.label.toLowerCase()))) differentials.push('Systemic Infection / Sepsis');
    if (!differentials.length) differentials.push('No specific differential identified from report text');

    const actions = [
      riskScore >= 70
        ? '🚨 Escalate to physician review within 6 hours.'
        : riskScore >= 45
        ? '⚠️ Schedule doctor follow-up within 48 hours.'
        : '✅ Routine monitoring. Follow up with doctor within 1 week.',
      '📊 Correlate report findings with outbreak trend dashboard.',
      '💊 Review current medications against detected markers.',
      '📱 Personalized health precautions pushed to patient account.',
    ];

    return res.status(200).json({
      riskScore,
      riskLevel,
      findings,
      differentials,
      actions,
      totalSignals: findings.length,
      analysisDepth: findings.length >= 4 ? 'Deep' : findings.length >= 2 ? 'Standard' : 'Basic',
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to analyze report', error: error.message });
  }
};
