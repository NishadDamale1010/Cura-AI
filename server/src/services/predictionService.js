const fs = require('fs');
const path = require('path');

let localModel = null;

function parseNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function loadLocalOutbreakDataset() {
  if (localModel) return localModel;

  const candidates = [
    path.join(process.cwd(), 'data', 'diseases-outbreak-database.csv'),
    path.join(process.cwd(), '..', 'ai-model', 'data', 'disease_data.csv'),
    path.join(process.cwd(), 'ai-model', 'data', 'disease_data.csv'),
  ];

  const datasetPath = candidates.find((filePath) => fs.existsSync(filePath));
  if (!datasetPath) {
    localModel = {
      source: 'heuristic-default',
      highOutbreakAvg: { temperature: 35, humidity: 80, fever: 1, cough: 1 },
      lowOutbreakAvg: { temperature: 29, humidity: 62, fever: 0, cough: 0 },
      threshold: 0.5,
    };
    return localModel;
  }

  const rows = fs.readFileSync(datasetPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const header = rows.shift().split(',').map((x) => x.trim().toLowerCase());
  const indexOf = (name) => header.indexOf(name);
  const idx = {
    fever: indexOf('fever'),
    cough: indexOf('cough'),
    temperature: indexOf('temperature'),
    humidity: indexOf('humidity'),
    outbreak: indexOf('outbreak'),
  };

  const parsed = rows.map((line) => {
    const cols = line.split(',').map((x) => x.trim());
    return {
      fever: parseNumber(cols[idx.fever]),
      cough: parseNumber(cols[idx.cough]),
      temperature: parseNumber(cols[idx.temperature], 30),
      humidity: parseNumber(cols[idx.humidity], 65),
      outbreak: parseNumber(cols[idx.outbreak]),
    };
  });

  const positive = parsed.filter((r) => r.outbreak >= 1);
  const negative = parsed.filter((r) => r.outbreak < 1);
  const avg = (list, key, fallback) => {
    if (!list.length) return fallback;
    return list.reduce((sum, item) => sum + parseNumber(item[key]), 0) / list.length;
  };

  localModel = {
    source: datasetPath,
    highOutbreakAvg: {
      temperature: avg(positive, 'temperature', 35),
      humidity: avg(positive, 'humidity', 80),
      fever: avg(positive, 'fever', 1),
      cough: avg(positive, 'cough', 1),
    },
    lowOutbreakAvg: {
      temperature: avg(negative, 'temperature', 29),
      humidity: avg(negative, 'humidity', 62),
      fever: avg(negative, 'fever', 0),
      cough: avg(negative, 'cough', 0),
    },
    threshold: 0.5,
  };

  return localModel;
}

function vectorDistance(a, b) {
  return Math.sqrt(
    ((a.temperature - b.temperature) ** 2)
    + ((a.humidity - b.humidity) ** 2)
    + ((a.fever - b.fever) ** 2) * 20
    + ((a.cough - b.cough) ** 2) * 20
  );
}

function runLocalPrediction(payload = {}) {
  const model = loadLocalOutbreakDataset();
  const symptoms = (payload.symptoms || []).map((s) => String(s).toLowerCase());
  const sample = {
    fever: symptoms.includes('fever') ? 1 : 0,
    cough: symptoms.includes('cough') ? 1 : 0,
    temperature: parseNumber(payload.temperature, 30),
    humidity: parseNumber(payload.humidity, 65),
  };

  const dHigh = vectorDistance(sample, model.highOutbreakAvg);
  const dLow = vectorDistance(sample, model.lowOutbreakAvg);
  const outbreakScore = Number((dLow / (dHigh + dLow + 1e-9)).toFixed(3));

  const risk = outbreakScore >= 0.75 ? 'High' : outbreakScore >= 0.5 ? 'Medium' : 'Low';
  const confidence = Math.max(61, Math.min(94, Math.round(70 + Math.abs(dLow - dHigh) * 2.5)));

  return {
    probability: outbreakScore,
    risk,
    confidence,
    model: 'local-outbreak-dataset',
    modelSource: model.source,
    explanation: `Risk inferred by similarity against outbreak vs non-outbreak patterns from local disease dataset.`,
  };
}

async function getPrediction(payload) {
  const url = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000/predict';
  let axiosClient = null;
  try {
    // Lazy-load axios so local model still works when dependencies are unavailable.
    // eslint-disable-next-line global-require
    axiosClient = require('axios');
  } catch (_error) {
    return runLocalPrediction(payload);
  }

  try {
    const { data } = await axiosClient.post(url, payload, { timeout: 5000 });
    return {
      ...data,
      model: data.model || 'external-ai-service',
    };
  } catch (_error) {
    return runLocalPrediction(payload);
  }
}

module.exports = { getPrediction, runLocalPrediction, loadLocalOutbreakDataset };
