/**
 * Q19 Reliability Gate Rules
 *
 * 目的：
 * - 防止 AI 在低可信資料下過度推論
 * - 控制「哪些分析可以給、哪些必須鎖」
 * - 所有規則為 system-level，不可被 prompt 覆蓋
 */

/**
 * @param {{
 *   level: "high" | "medium" | "low",
 *   score: number,
 *   flags?: string[]
 * }} reliability
 */
function enforceReliabilityGate(reliability) {
  const level = reliability?.level || "low";

  // === HIGH RELIABILITY ===
  if (level === "high") {
    return {
      allowFullAnalysis: true,
      allowedSections: ["identity", "trap", "earlyWarnings"],
      notice: null,
    };
  }

  // === MEDIUM RELIABILITY ===
  if (level === "medium") {
    return {
      allowFullAnalysis: true,
      allowedSections: ["identity", "earlyWarnings"],
      notice:
        "Some answers show inconsistency. Analysis is limited to stable patterns only.",
    };
  }

  // === LOW RELIABILITY ===
  return {
    allowFullAnalysis: false,
    allowedSections: [],
    notice:
      "Your responses show high inconsistency or low confidence signals. A full Q19 analysis cannot be generated from this session.",
  };
}

module.exports = { enforceReliabilityGate };
