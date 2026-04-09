const { buildSurveillanceDataset } = require('../services/surveillanceService');

async function getDataset(req, res) {
  try {
    const dataset = await buildSurveillanceDataset();
    return res.status(200).json(dataset);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to build surveillance dataset', error: error.message });
  }
}

async function getStats(req, res) {
  try {
    const dataset = await buildSurveillanceDataset();
    return res.status(200).json({
      lastUpdated: dataset.lastUpdated,
      dataSource: dataset.sources.join(' + '),
      ...dataset.stats,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
}

async function getRegions(req, res) {
  try {
    const dataset = await buildSurveillanceDataset();
    return res.status(200).json({
      lastUpdated: dataset.lastUpdated,
      count: dataset.regions.length,
      regions: dataset.regions,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch regions', error: error.message });
  }
}

async function getAlerts(req, res) {
  try {
    const dataset = await buildSurveillanceDataset();
    return res.status(200).json({
      lastUpdated: dataset.lastUpdated,
      count: dataset.alerts.length,
      alerts: dataset.alerts,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch alerts', error: error.message });
  }
}

async function getTrends(req, res) {
  try {
    const dataset = await buildSurveillanceDataset();
    return res.status(200).json({
      lastUpdated: dataset.lastUpdated,
      trends: dataset.trends,
      diseaseDistribution: dataset.diseaseDistribution,
      ageRisk: dataset.ageRisk,
      insights: dataset.insights,
      weatherSignals: dataset.weatherSignals,
      who: dataset.who,
      dataGov: dataset.dataGov,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch trends', error: error.message });
  }
}

module.exports = {
  getDataset,
  getStats,
  getRegions,
  getAlerts,
  getTrends,
};
