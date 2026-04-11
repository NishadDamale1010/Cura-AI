import { motion } from 'framer-motion';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';

function mapColor(level) {
  if (level === 'high') return '#ef4444';
  if (level === 'medium') return '#f59e0b';
  return '#22c55e';
}

export default function InteractiveMap({ regions, selectedRegion, onRegionSelect }) {
  if (!regions || regions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card h-80 flex-center"
      >
        <p className="text-sm opacity-60">Loading map data...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card p-5 xl:col-span-3"
    >
      <h3 className="mb-4 text-lg font-semibold">Interactive Risk Map</h3>
      <div className="h-80 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--card-border)' }}>
        <MapContainer
          center={[22.9734, 78.6569]}
          zoom={5}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {regions
            .filter((region) => region.lat && region.lng)
            .map((region) => {
              const isSelected = selectedRegion?.region === region.region;
              return (
                <CircleMarker
                  key={region.region}
                  center={[region.lat, region.lng]}
                  radius={Math.max(6, Math.min(24, (region.riskScore || 0) / 4))}
                  pathOptions={{
                    color: mapColor(region.riskLevel),
                    fillOpacity: isSelected ? 0.8 : 0.6,
                    weight: isSelected ? 3 : 2,
                  }}
                  eventHandlers={{
                    click: () => onRegionSelect(region),
                    mouseover: (e) => {
                      e.target.setStyle({
                        fillOpacity: 0.9,
                        weight: 3,
                      });
                    },
                    mouseout: (e) => {
                      e.target.setStyle({
                        fillOpacity: isSelected ? 0.8 : 0.6,
                        weight: isSelected ? 3 : 2,
                      });
                    },
                  }}
                >
                  <Popup>
                    <motion.div className="space-y-1 text-xs">
                      <p className="font-semibold">{region.region}</p>
                      <p>Risk Score: {region.riskScore}</p>
                      <p>Active Cases: {(region.activeCases || 0).toLocaleString()}</p>
                      <p>Humidity: {region.humidity ?? 'NA'}%</p>
                      <p>AQI: {region.aqi ?? 'N/A'}</p>
                    </motion.div>
                  </Popup>
                </CircleMarker>
              );
            })}
        </MapContainer>
      </div>
    </motion.div>
  );
}
