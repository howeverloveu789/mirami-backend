// LV5 computeSignals – New LV5+
// Input: answers[] in [-2, -1, 0, 1, 2]
// Output: { rawAnswers, signals[] }

const { LV5_SIGNALS } = require("./lv5_signals.js");

function normalizeAnswer(raw) {
  if (typeof raw !== "number" || Number.isNaN(raw)) return 0.5;
  const clamped = Math.max(-2, Math.min(2, raw));
  return (clamped + 2) / 4;
}

function computeLv5Signals(answers = []) {
  const signals = [];

  Object.keys(LV5_SIGNALS).forEach((qid) => {
    const raw = answers[qid];
    const baseValue = normalizeAnswer(raw);

    LV5_SIGNALS[qid].forEach((sig) => {
      const weight = sig.role === "primary" ? 1.0 : 0.6;
      const value = Number((baseValue * weight).toFixed(3));

      signals.push({
        id: sig.id,
        line: sig.line,
        role: sig.role,
        value,
        questionId: Number(qid)
      });
    });
  });

  return {
    rawAnswers: answers,
    signals
  };
}

module.exports = { computeLv5Signals };
