export default async function handler(req, res) {
  try {
    const response = await fetch("https://pskreporter.info/cgi-bin/pskstats.pl?statistics=1");
    const text = await response.text();

    console.log("RAW PSKReporter TEXT:");
    console.log(text.slice(0, 500));  // перші 500 символів

    res.status(200).json({ debug: text.slice(0, 500) }); // тимчасово віддаємо raw
  } catch (err) {
    console.error("Failed to fetch PSKReporter stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}
