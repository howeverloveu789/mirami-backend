// src/core/analysis/analyzeQ19ToJSON.js

const {
  AXIS_MAP,
  OPTION_SCORE
} = require("../../config/q19_thinking_28.json");

/**
 * Q19_ANALYSIS_JSON_v1
 * CLEANED & REWEIGHTED VERSION
 *
 * Structure-only
 * No narrative
 */

function analyzeQ19ToJSON(answers = {}) {
  const axis_results = {};
  const scoredAxes = [];
  const redAxes = [];

  const answeredCount = Object.keys(answers).length;
  let confidence_level = "high";
  if (answeredCount < 28) confidence_level = "medium";
  if (answeredCount < 25) confidence_level = "low";

  for (const [axis, questions] of Object.entries(AXIS_MAP)) {
    const rawScores = [];

    questions.forEach((qId) => {
      const ans = answers[qId];
      if (ans && Object.prototype.hasOwnProperty.call(OPTION_SCORE, ans)) {
        rawScores.push(OPTION_SCORE[ans]);
      }
    });

    // raw weight preserved
    const raw_sum =
      rawScores.length > 0
        ? rawScores.reduce((a, b) => a + b, 0)
        : 0;

    const normalized = Math.max(-2, Math.min(2, raw_sum));

    // signal strength (supports 3 or 4 questions)
    let signal_strength = "weak";
    if (rawScores.length >= 3) {
      const counts = {};
      rawScores.forEach(v => counts[v] = (counts[v] || 0) + 1);
      const maxCount = Math.max(...Object.values(counts));

      if (maxCount >= 2) {
        signal_strength = "strong";
      } else {
        signal_strength = "moderate";
      }
    }

    let state = "green";
    if (Math.abs(normalized) === 1) state = "yellow";
    if (Math.abs(normalized) === 2) state = "red";

    if (state === "red") redAxes.push(axis);

    const mode = deriveMode(raw_sum);

    axis_results[axis] = {
      raw_sum,
      normalized,
      state,
      mode,
      signal_strength
    };

    scoredAxes.push({
      axis,
      raw_sum,
      signal_strength
    });
  }

  const dominant = scoredAxes
    .filter(a => a.signal_strength === "strong")
    .sort((a, b) => Math.abs(b.raw_sum) - Math.abs(a.raw_sum))[0] || null;

  const fragile = scoredAxes
    .filter(a => a.raw_sum < 0)
    .sort((a, b) => a.raw_sum - b.raw_sum)[0] || null;

  const overload_risk =
    redAxes.length >= 2 &&
    (redAxes.includes("pressure_response") ||
     redAxes.includes("uncertainty_tolerance"));

  const global_flags = {
    overload_risk,
    stall_pattern_detected: false,
    volatility_window: overload_risk ? "next_7_14_days" : "none",
    dominant_axis: dominant ? dominant.axis : null,
    fragile_axis: fragile ? fragile.axis : null
  };

  const handoff_to_P = {
    allowed_focus: ["movement", "pacing", "tension", "closure"],
    forbidden_moves: ["labeling", "diagnosis", "advice"],
    time_scope: "current_cycle_only"
  };

  return {
    meta: {
      version: "Q19_ANALYSIS_JSON_v1",
      axis_count: 9,
      question_count: 28,
      scoring_mode: "behavioral_choice",
      confidence_level
    },
    axis_results,
    global_flags,
    handoff_to_P
  };
}

function deriveMode(raw_sum) {
  if (raw_sum >= 3) return "amplified_operation";
  if (raw_sum <= -3) return "constrained_operation";
  return "baseline_operation";
}

module.exports = {
  analyzeQ19ToJSON
};
