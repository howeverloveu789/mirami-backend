// src/core/analysis/q19SignalAnalyzer.js

/**
 * Analyze static behavior signals from Q19 answers
 * ❌ No language
 * ❌ No advice
 * ✅ Deterministic patterns only
 */
function analyzeQ19Signals({ answers = {}, scoring = {}, reliability = {} }) {
  let contradictionCount = 0;
  let extremeSwitch = false;

  const agreeCount = Object.values(answers).filter(v => v === "agree").length;
  const disagreeCount = Object.values(answers).filter(v => v === "disagree").length;

  // 極端切換：大量 agree + disagree 並存
  if (agreeCount > 20 && disagreeCount > 20) {
    extremeSwitch = true;
    contradictionCount += 2;
  }

  // 控制型題組（示意，可慢慢補）
  const controlQuestions = ["q1", "q2", "q3", "q4", "q5"];
  const controlAgree = controlQuestions.filter(
    q => answers[q] === "agree"
  ).length;

  // 壓力反應題組
  const pressureQuestions = ["q61", "q62", "q63"];
  const pressureAgree = pressureQuestions.filter(
    q => answers[q] === "agree"
  ).length;

  if (controlAgree >= 4 && pressureAgree >= 2) {
    contradictionCount += 1;
  }

  /* =========================
     SIGNALS (static profile)
  ========================= */
  const signals = {
    rhythm_type:
      extremeSwitch ? "fast-switch" : "stable-linear",

    control_style:
      controlAgree >= 4 ? "over-optimize" : "adaptive",

    stress_response:
      pressureAgree >= 2 ? "pressure-focus" : "pressure-withdraw"
  };

  /* =========================
     DELTAS (instability)
  ========================= */
  const deltas = {
    contradiction_count: contradictionCount,
    extreme_switch: extremeSwitch
  };

  return { signals, deltas };
}

module.exports = {
  analyzeQ19Signals
};
