// === 完全對齊你專案的 evaluateQuality.js 最終版 ===

/**
 * Quality Engine (v3.8)
 * - Scores MIRAMI report quality
 * - Scores answer reliability
 * - Scores fallback usage
 */

function evaluateQuality({ reliability, used_fallback, signals }) {
  let score = 100;

  // Reliability impact
  if (reliability?.level === "low") score -= 25;
  if (reliability?.level === "normal") score -= 10;

  // Fallback impact
  if (used_fallback) score -= 20;

  // RED FLAG impact
  const redFlags = Object.values(signals || {}).filter(v => v === "RED_FLAG");
  score -= redFlags.length * 5;

  if (score < 0) score = 0;

  return { score };
}

module.exports = { evaluateQuality };