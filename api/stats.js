export default async function handler(req, res) {
  const url = "https://pskreporter.info/cgi-bin/pskquery.pl?flowStartSeconds=3600&format=json";

  try {
    const response = await fetch(url);
    const data = await response.json();

    const bandMap = {
      "80m": [3000000, 4000000],
      "40m": [7000000, 7300000],
      "30m": [10100000, 10150000],
      "20m": [14000000, 14350000],
      "17m": [18068000, 18168000],
      "15m": [21000000, 21450000],
      "12m": [24890000, 24990000],
      "10m": [28000000, 29700000]
    };

    const bandCounts = {};

    for (const [band, [minFreq, maxFreq]] of Object.entries(bandMap)) {
      bandCounts[band] = 0;
    }

    for (const report of data) {
      const freq = report.frequency;
      if (!freq) continue;

      for (const [band, [minFreq, maxFreq]] of Object.entries(bandMap)) {
        if (freq >= minFreq && freq <= maxFreq) {
          bandCounts[band]++;
          break;
        }
      }
    }

    res.status(200).json({ bands: bandCounts });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch PSKReporter data", details: e.message });
  }
}
