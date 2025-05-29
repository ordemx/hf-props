
import { useEffect, useState } from 'react';
import { evaluateBandScore } from '../lib/evaluate';

export default function Home() {
  const [position, setPosition] = useState(null);
  const [qsoStats, setQsoStats] = useState(null);
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(new Date());

  const bands = ["80m", "40m", "20m", "15m", "10m"];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setPosition({ lat, lon });

          try {
            const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
            const sunData = await (await fetch(url)).json();
            const sr = new Date(sunData.results.sunrise);
            const ss = new Date(sunData.results.sunset);
            const dawn = new Date(sr.getTime() - 60 * 60 * 1000);
            const dusk = new Date(ss.getTime() + 60 * 60 * 1000);
            const isDay = now >= sr && now < ss;
            const inGreyline = (now >= dawn && now < sr) || (now >= ss && now < dusk);

            const sfi = 125, k = 2, xray = "B1.2", bz = 1, vsw = 380;
            const utcHour = now.getUTCHours();

            const bandScores = bands.map(band => {
              const score = evaluateBandScore({ sfi, k, xray, bz, vsw, band, isDay, inGreyline, utcHour });
              return { band, score };
            });

            setScores(bandScores);
          } catch (e) {
            setError("Sun data fetch failed");
          }
        },
        (err) => setError("Unable to get location")
      );
    }
  }, [now]);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setQsoStats(data))
      .catch(() => setError("Failed to load QSO stats"));
  }, []);

  function interpretScore(score) {
    if (score >= 85) return "Wide Open";
    if (score >= 70) return "Open";
    if (score >= 50) return "Spotty";
    if (score >= 30) return "Weak";
    return "Closed";
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>📡 HF Propagation Status</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {position && <p>Your location: {position.lat.toFixed(2)}, {position.lon.toFixed(2)}</p>}
      <p>Time (UTC): {now.toUTCString()}</p>
      <h2>Band Conditions</h2>
      <ul>
        {scores.map(({ band, score }) => {
          const qso = qsoStats?.bands?.[band] ?? "N/A";
          return (
            <li key={band}>
              <strong>{band}</strong> — Score: {score} ({interpretScore(score)}), QSO: {qso}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
