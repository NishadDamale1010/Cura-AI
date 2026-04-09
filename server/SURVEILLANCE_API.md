# Surveillance API (Real Data Aggregation)

Base URL: `http://localhost:5000/api`

## Endpoints

- `GET /stats`
- `GET /regions`
- `GET /alerts`
- `GET /trends`
- `GET /dataset` (combined payload)

All routes require `Authorization: Bearer <jwt>`.

## Sample response: `GET /stats`

```json
{
  "lastUpdated": "2026-04-09T11:50:31.114Z",
  "dataSource": "data.gov.in + IDSP + WHO GHO + disease.sh + Open-Meteo",
  "totalCases": 45035776,
  "activeCases": 1873,
  "criticalAlerts": 4,
  "recoveryRate": 98.81,
  "aiConfidenceScore": 82,
  "deaths": 533570
}
```

## Sample response: `GET /regions`

```json
{
  "lastUpdated": "2026-04-09T11:50:31.114Z",
  "count": 36,
  "regions": [
    {
      "region": "Maharashtra",
      "totalCases": 8136948,
      "activeCases": 412,
      "recovered": 7986502,
      "deaths": 148034,
      "riskLevel": "medium",
      "riskColor": "orange",
      "latitude": null,
      "longitude": null,
      "source": "disease.sh"
    }
  ]
}
```

## Sample response: `GET /alerts`

```json
{
  "lastUpdated": "2026-04-09T11:50:31.114Z",
  "count": 12,
  "alerts": [
    {
      "disease": "Dengue",
      "region": "Maharashtra",
      "severity": "high",
      "timestamp": "2026-04-08",
      "source": "IDSP"
    }
  ]
}
```

## Sample response: `GET /trends`

```json
{
  "lastUpdated": "2026-04-09T11:50:31.114Z",
  "trends": [
    { "date": "2026-03-01", "cases": 45033001 }
  ],
  "diseaseDistribution": [
    { "disease": "COVID-19", "cases": 45035776, "source": "disease.sh" },
    { "disease": "Dengue", "cases": 1240, "source": "data.gov.in + IDSP" }
  ],
  "ageRisk": [
    { "ageGroup": "0-17", "riskIndex": 29 },
    { "ageGroup": "18-35", "riskIndex": 49 },
    { "ageGroup": "36-59", "riskIndex": 65 },
    { "ageGroup": "60+", "riskIndex": 77 }
  ],
  "insights": [
    {
      "message": "Spike detected in COVID-19 trend (+23.4% over the last week).",
      "confidence": 83,
      "type": "trend"
    }
  ]
}
```
