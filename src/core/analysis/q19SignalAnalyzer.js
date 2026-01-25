// === 完全對齊你專案的 q19SignalAnalyzer.js 最終版 ===

/**
 * Analyze signals and deltas from Q19 answers
 * - Detects RED FLAG triggers
 * - Detects sudden shifts
 */

function analyzeSignals(answers = {}) {
  const signals = {};
  const deltas = {};

  // RED FLAG detection
  const redFlagQuestions = ["q5", "q10", "q17", "q24"];
  for (const q of redFlagQuestions) {
    if (answers[q] === "C") {
      signals[q] = "RED_FLAG";
    }
  }

  // Delta detection (simple version)
  const groups = [
    ["q1", "q2", "q3", "q4", "q5", "q6", "q7"],
    ["q8", "q9", "q10", "q11", "q12", "q13", "q14"],
    ["q15", "q16", "q17", "q18", "q19", "q20", "q21"],
    ["q22", "q23", "q24", "q25", "q26", "q27", "q28"]
  ];

  groups.forEach((group, i) => {
    let A = 0, B = 0, C = 0;
    for (const q of group) {
      const v = answers[q];
      if (v === "A") A++;
      else if (v === "B") B++;
      else if (v === "C") C++;
    }
    deltas["group_" + (i + 1)] = { A, B, C };
  });

  return { signals, deltas };
}

module.exports = { analyzeSignals };