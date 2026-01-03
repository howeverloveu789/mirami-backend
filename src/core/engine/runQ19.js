// src/core/engine/runQ19.js

const q19Config = require('../../config/q19_thinking_99.json');
const { scoreQ19 } = require('../scoring/q19_scoring');
const { buildQ19View } = require('../report/q19_report_view');

/**
 * @param {Record<string, string>} answers
 */
function runQ19(answers) {
  // 1. 先算分（純數值＋群組）
  const scoring = scoreQ19(answers);

  // 2. 再把分數＋作答丟進 view builder
  //    由它根據結構產出：
  //    - primaryRhythm
  //    - identity / trap / earlyWarnings 三段
  //    - 內部標記 P_MODE / LOCKED_20
  const report = buildQ19View(scoring, answers, {
    reportId: scoring?.meta?.reportId || undefined,
  });

  return {
    meta: q19Config.meta,
    scoring,
    report,
  };
}

module.exports = { runQ19 };
