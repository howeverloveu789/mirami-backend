// === 完全對齊你專案的 q19AxisBuilder.js 最終版 ===

/**
 * Build axis_scores from Q19 answers
 * - Counts A/B/C per axis
 * - Returns normalized strength per axis
 */

function buildAxisScores(answers = {}) {
  const axisMap = {
    q1: "initiative",
    q2: "initiative",
    q3: "structure",
    q4: "structure",
    q5: "boundaries",
    q6: "boundaries",
    q7: "load",
    q8: "load",
    q9: "avoidance",
    q10: "avoidance",
    q11: "control",
    q12: "control",
    q13: "rhythm",
    q14: "rhythm",
    q15: "pressure",
    q16: "pressure",
    q17: "withdrawal",
    q18: "withdrawal",
    q19: "time",
    q20: "time",
    q21: "clarity",
    q22: "clarity",
    q23: "conflict",
    q24: "conflict",
    q25: "support",
    q26: "support",
    q27: "recovery",
    q28: "recovery"
  };

  const axisScores = {};

  for (const [q, v] of Object.entries(answers)) {
    const axis = axisMap[q];
    if (!axis) continue;

    if (!axisScores[axis]) {
      axisScores[axis] = { A: 0, B: 0, C: 0 };
    }

    if (["A", "B", "C"].includes(v)) {
      axisScores[axis][v]++;
    }
  }

  // Normalize
  for (const axis of Object.keys(axisScores)) {
    const total = axisScores[axis].A + axisScores[axis].B + axisScores[axis].C;
    if (total > 0) {
      axisScores[axis] = {
        A: axisScores[axis].A / total,
        B: axisScores[axis].B / total,
        C: axisScores[axis].C / total
      };
    }
  }

  return axisScores;
}

module.exports = { buildAxisScores };