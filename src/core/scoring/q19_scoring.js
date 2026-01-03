// src/core/scoring/q19_scoring.js

// 這裡先放一個非常簡單的 scoring，之後再從 TS 版搬完整邏輯過來
function scoreQ19(answers) {
  const groups = [];

  // 假：所有分數都設定為中度，先讓報告跑起來
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

  // 也給一些 composite 分數，讓報告的身份感模組有東西可以用
  return {
    groups,
    essenceGrabScore: 0.8,
    chaosToSystemScore: 0.7,
    pressureFocusScore: 0.7,
    wasteSensitivityScore: 0.6,
  };
}

module.exports = { scoreQ19 };
