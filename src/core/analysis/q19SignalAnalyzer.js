// src/core/analysis/q19SignalAnalyzer.js

/**
 * Q19 Signal Consistency Analyzer
 *
 * Purpose:
 * - Detect internal inconsistencies or instability in answers
 * - Provide FLAGS ONLY (no labels, no interpretation)
 *
 * This module MUST NOT:
 * - Describe personality or style
 * - Generate language
 * - Be used directly in user-facing output
 */

function analyzeQ19Signals({ answers = {} }) {
  let contradiction_count = 0;
  let extreme_switch = false;

  const values = Object.values(answers);

  const agreeCount = values.filter(v => v === "agree").length;
  const disagreeCount = values.filter(v => v === "disagree").length;

  // 極端分裂：大量 agree 與 disagree 同時存在
  if (agreeCount > 18 && disagreeCount > 18) {
    extreme_switch = true;
    contradiction_count += 2;
  }

  // 高反轉密度（短題距內反向）
  // 注意：這裡不判斷「好壞」，只記錄不穩定
  let flipCount = 0;
  let last = null;

  for (const v of values) {
    if (last && v !== last) flipCount++;
    last = v;
  }

  if (flipCount > values.length * 0.6) {
    contradiction_count += 1;
  }

  /**
   * Output is FLAGS ONLY
   * Downstream may use this for:
   * - reliability gating
   * - confidence weighting
   */
  return {
    flags: {
      extreme_switch,
      contradiction_count
    }
  };
}

module.exports = {
  analyzeQ19Signals
};
