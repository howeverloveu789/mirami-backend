// src/core/scoring/q19_scoring.js

function scoreQ19(answers) {
  const groups = [];

  const keys = [
    'patience_threshold',
    'rhythm_instability',
    'dosage_illusion',
    'signal_misread',
    'unable_to_stop',
    'environment_sensitive',
    'social_interference',
    'perfectionism',
    'inertia_dependence',
  ];

  for (const key of keys) {
    groups.push({
      key,
      score: 0.6,
      label: 'medium',
    });
  }

  return {
    groups,
    essenceGrabScore: 0.8,
    chaosToSystemScore: 0.7,
    pressureFocusScore: 0.7,
    wasteSensitivityScore: 0.6,
  };
}

/**
 * Reliability builder (additive)
 * 不做語意分析、不評價內容，只看「結構可信度」
 */
function buildReliability({ answers, scoring }) {
  const total = Object.keys(answers || {}).length;

  // 基本門檻
  if (total < 90) {
    return {
      level: "low",
      score: 0.3,
      flags: ["incomplete_answers"],
    };
  }

  // control 題（簡化版）
  const controlMismatch =
    answers.q92 !== "disagree" ||
    !answers.q93 ||
    answers.q94;

  if (controlMismatch) {
    return {
      level: "low",
      score: 0.4,
      flags: ["control_question_mismatch"],
    };
  }

  // 長答題是否有基本輸入
  const longTextKeys = ["q22", "q23"];
  const weakLongText = longTextKeys.some(
    k => !answers[k] || answers[k].length < 8
  );

  if (weakLongText) {
    return {
      level: "medium",
      score: 0.6,
      flags: ["low_signal_longtext"],
    };
  }

  return {
    level: "high",
    score: 0.85,
    flags: [],
  };
}

module.exports = {
  scoreQ19,
  buildReliability,
};
