import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, Droplets, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet';
import api from '../services/api';

const color = { Low: 'green', Medium: 'orange', High: 'red' };

function offsetCoordinate(base, i) {
  const delta = 0.04 + i * 0.01;
  return [base[0] + delta, base[1] + delta];
}

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>{children}</div>
);

export default function NearbyRisk() {
  const [records, setRecords] = useState([]);
  const [center, setCenter] = useState([18.52, 73.85]);
  const [locationName, setLocationName] = useState('Pune');
  const [trendPayload, setTrendPayload] = useState(null);
  const [error, setError] = useState('');

  const loadTrends = async (lat, lng, name = 'Current Location') => {
    const { data } = await api.get('/api/trends/local', { params: { lat, lng, location: name } });
    setTrendPayload(data);
  };

  useEffect(() => {
    api.get('/api/data/all').then((r) => setRecords(r.data)).catch(() => {});
    if (!navigator.geolocation) {
      loadTrends(center[0], center[1], locationName).catch(() => setError('Unable to load local trend intelligence.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCenter([lat, lng]);
        setLocationName('Current Location');
        loadTrends(lat, lng, 'Current Location').catch(() => setError('Unable to load local trend intelligence.'));
      },
      () => { loadTrends(center[0], center[1], locationName).catch(() => setError('Unable to load local trend intelligence.')); },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  }, []);

  const trendMarkers = useMemo(() => {
    if (!trendPayload?.trends?.length) return [];
    return trendPayload.trends.slice(0, 3).map((item, i) => ({ ...item, point: offsetCoordinate(center, i) }));
  }, [trendPayload, center]);

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white grid place-items-center shadow-lg">
          <MapPin size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Disease Risk Map</h1>
          <p className="text-sm text-slate-500">Live location + real-time intelligence from Open-Meteo, GDELT, and CDC</p>
        </div>
      </motion.div>

      {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">{error}</p>}

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="grid md:grid-cols-3 gap-3">
          <Card className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-cyan-50 text-cyan-500 grid place-items-center"><MapPin size={16} /></div>
            <div><p className="text-[10px] uppercase tracking-wider text-slate-400">Area</p><p className="font-semibold text-slate-800">{trendPayload?.location || locationName}</p></div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-rose-50 text-rose-500 grid place-items-center"><Thermometer size={16} /></div>
            <div><p className="text-[10px] uppercase tracking-wider text-slate-400">Temperature</p><p className="font-semibold text-slate-800">{trendPayload?.weather?.temperature ?? '--'}C</p></div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-500 grid place-items-center"><Droplets size={16} /></div>
            <div><p className="text-[10px] uppercase tracking-wider text-slate-400">Humidity</p><p className="font-semibold text-slate-800">{trendPayload?.weather?.humidity ?? '--'}%</p></div>
          </Card>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-3 h-[520px]">
          <div className="h-full rounded-xl overflow-hidden border border-slate-100">
            <MapContainer center={center} zoom={8} className="h-full w-full">
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={center}><Popup>You are here ({locationName})</Popup></Marker>
              {trendMarkers.map((t) => (
                <CircleMarker key={t.disease} center={t.point} radius={10} pathOptions={{ color: color[t.risk] || 'blue' }}>
                  <Popup><b>{t.disease.toUpperCase()}</b><br />Risk: {t.risk}<br />Score: {t.score}<br />{t.reason}</Popup>
                </CircleMarker>
              ))}
              {records.filter((r) => r.location?.lat && r.location?.lng).map((r) => (
                <CircleMarker key={r._id} center={[r.location.lat, r.location.lng]} radius={7} pathOptions={{ color: color[r.risk] || 'blue' }}>
                  <Popup>{r.location.city}: {r.risk} ({r.probability})</Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
