export default async function handler(req, res) {
  try {
    const response = await fetch("https://pskreporter.info/cgi-bin/pskstats.pl?statistics=1");
    const text = await response.text();

    // Знайти перший рядок, що починається з {
    const lines = text.split("\n");
    const jsonLine = lines.find(line => line.trim().startsWith("{"));

    if (!jsonLine) throw new Error("No JSON object found in response");

    const stats = JSON.parse(jsonLine);
    res.status(200).json(stats);
  } catch (err) {
    console.error("Failed to fetch PSKReporter stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}
