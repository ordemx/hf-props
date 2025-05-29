export default async function handler(req, res) {
  try {
    const response = await fetch("https://pskreporter.info/cgi-bin/pskstats.pl?statistics=1");
    const text = await response.text();

    // PSKReporter іноді повертає preamble, тому шукаємо JSON з першої дужки
    const jsonStart = text.indexOf("{");
    if (jsonStart === -1) throw new Error("No JSON found in response");

    const rawJson = text.slice(jsonStart);
    const stats = JSON.parse(rawJson);

    res.status(200).json(stats);
  } catch (err) {
    console.error("Failed to fetch PSKReporter stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}
