export default async function handler(req, res) {
  try {
    const response = await fetch("https://pskreporter.info/cgi-bin/pskstats.pl?statistics=1");
    const text = await response.text();

    // Діагностика
    if (!text.includes("{")) {
      console.error("Raw response (unexpected):", text.slice(0, 300));
      throw new Error("Response did not contain JSON");
    }

    const jsonStart = text.indexOf("{");
    const rawJson = text.slice(jsonStart);
    const stats = JSON.parse(rawJson);

    res.status(200).json(stats);
  } catch (err) {
    console.error("Failed to fetch PSKReporter stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}
