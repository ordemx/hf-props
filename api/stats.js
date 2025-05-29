export default async function handler(req, res) {
  try {
    const response = await fetch("https://pskreporter.info/cgi-bin/pskstats.pl?statistics=1");
    const text = await response.text();

    const lines = text.split("\n");
    const candidate = lines.find(line => line.trim().startsWith("{"));

    if (!candidate) throw new Error("No JSON-like line found");

    // Мінімальна корекція: додаємо лапки до ключів типу bands, modes
    const fixed = candidate.replace(/([{,]\\s*)(\\w+)(\\s*:)/g, '$1"$2"$3');

    const stats = JSON.parse(fixed);
    res.status(200).json(stats);
  } catch (err) {
    console.error("Failed to fetch PSKReporter stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}
