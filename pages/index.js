
import { useEffect, useState } from 'react';

export default function Home() {
  const [position, setPosition] = useState(null);
  const [qsoStats, setQsoStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Geolocation error", err);
          setError("Unable to get location");
        }
      );
    }
  }, []);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setQsoStats(data))
      .catch((err) => {
        console.error("Error fetching QSO stats", err);
        setError("Failed to load data");
      });
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>📡 HF Propagation Status</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {position && (
        <p>Your location: {position.lat.toFixed(2)}, {position.lon.toFixed(2)}</p>
      )}
      <p>Time (UTC): {new Date().toUTCString()}</p>
      {qsoStats ? (
        <div>
          <h2>QSO Stats (last hour)</h2>
          <ul>
            {Object.entries(qsoStats.bands || {}).map(([band, count]) => (
              <li key={band}>{band}: {count} QSO</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading stats...</p>
      )}
    </div>
  );
}
