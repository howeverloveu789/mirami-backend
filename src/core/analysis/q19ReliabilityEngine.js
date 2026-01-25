// === 完全對齊你專案的 q19ReliabilityEngine.js 最終版 ===

/**
 * Evaluate reliability level from Q19 answers
 * - Checks completeness
 * - Checks balance
 * - Returns level: high / normal / low
 */

function evaluateReliability(answers = {}) {
  const total = Object.keys(answers).length;
  if (total < 20) return { level: "low" };

  let A = 0, B = 0, C = 0;
  for (const v of Object.values(answers)) {
    if (v === "A") A++;
    else if (v === "B") B++;
    else if (v === "C") C++;
  }

  const max = Math.max(A, B, C);
  const min = Math.min(A, B, C);

  if (max - min <= 4) return { level: "high" };
  return { level: "normal" };
}

module.exports = { evaluateReliability };