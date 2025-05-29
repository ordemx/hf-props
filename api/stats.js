export default async function handler(req, res) {
  try {
    const response = await fetch("https://pskreporter.info/cgi-bin/pskstats.pl?statistics=1");
    const text = await response.text();

    const jsonStart = text.indexOf('{');
    const rawJson = text.slice(jsonStart);
    const stats = JSON.parse(rawJson);

    res.status(200).json(stats);
  } catch (err) {
    console.error("stats API error:", err);
    res.status(500).json({ error: "stats fetch failed" });
  }
}
