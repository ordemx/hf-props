
export function evaluateBandScore({ sfi, k, xray, bz, vsw, band, isDay, inGreyline, utcHour }) {
  let score = 50 * 0.9; // solarCycleFactor

  if (sfi >= 150) score += 20;
  else if (sfi >= 130) score += 15;
  else if (sfi >= 110) score += 10;
  else if (sfi >= 90) score += 5;
  else score -= 5;

  if (k >= 5) score -= 20;
  else if (k >= 4) score -= 10;
  else if (k <= 2) score += 5;

  if (xray.startsWith("X")) score -= 25;
  else if (xray.startsWith("M")) score -= 15;
  else if (xray.startsWith("C")) score -= 5;

  if (bz < -5) score -= 10;
  else if (bz < 0) score -= 5;
  else score += 5;

  if (vsw > 600) score -= 5;
  else if (vsw < 400) score += 5;

  if (band === "80m") {
    score += isDay ? -10 : 15;
    if (inGreyline) score += 7;
  }
  if (band === "40m") {
    score += isDay ? 0 : 10;
    if (inGreyline) score += 5;
  }
  if (band === "20m") {
    score += isDay ? 10 : 0;
    if (inGreyline) score += 3;
  }
  if (band === "15m") score += isDay ? 15 : -5;
  if (band === "10m") score += isDay ? 10 : -15;

  if ((band === "10m" || band === "15m") && (utcHour < 9 || utcHour > 19)) score -= 25;

  return Math.max(0, Math.min(100, score));
}
