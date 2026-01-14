throw new Error("🔥 RESOLVE_FINAL_REPORT_REACHED");

/**
 * resolveFinalReport — FINAL (LOCKED)
 * 系統最終出口（不可違反）
 *
 * 規則：
 * - 只依賴 answers distribution
 * - 一旦進入「過渡鏡子」，MIRAMI 永遠不會被呼叫
 * - 不依賴 reliability、不看 analysis、不看 prompt
 */

console.log("🔥 RESOLVE_FINAL_REPORT_FILE_LOADED");

const transitionalMirror = require("./fallback/transitionalMirror.en.json");
const { sendToMIRAMI } = require("./sendToMIRAMI");
const { isNeutralDistribution } = require("./distributionGate");

/**
 * normalizeAnswers
 * - 將 answers 統一轉成 ["A","B","C"] array
 * - 防止前端送成 { value: "B" }、{ answer: "B" } 等結構
 */
function normalizeAnswers(answers = {}) {
  if (!answers || typeof answers !== "object") return [];

  return Object.values(answers)
    .map(v => {
      if (typeof v === "string") return v;
      if (v && typeof v === "object") {
        if (typeof v.value === "string") return v.value;
        if (typeof v.answer === "string") return v.answer;
      }
      return null;
    })
    .filter(v => v === "A" || v === "B" || v === "C");
}

async function resolveFinalReport({ answers = {}, payload }) {
  console.log("🔥 RESOLVE_FINAL_REPORT_HIT");

  const normalizedAnswers = normalizeAnswers(answers);

  console.log("🧪 [FINAL REPORT] normalizedAnswers =", normalizedAnswers);

  // ================================
  // DISTRIBUTION GATE（最終寫死）
  // ================================
  if (isNeutralDistribution(normalizedAnswers)) {
    console.log("🧪 NEUTRAL_DISTRIBUTION = TRUE → USE TRANSITIONAL MIRROR");

    return {
      mode: "transitional_fixed",
      final_report: [
        transitionalMirror.key_line,
        "",
        ...transitionalMirror.content
      ].join("\n\n")
    };
  }

  // ================================
  // 非過渡狀態，唯一允許 MIRAMI
  // ================================
  console.log("🚀 NON-NEUTRAL → CALL MIRAMI");

  const miramiResult = await sendToMIRAMI(payload);

  if (!miramiResult || !miramiResult.content) {
    throw new Error("MIRAMI_EMPTY_RESPONSE");
  }

  return {
    mode: "mirami",
    final_report: miramiResult.content
  };
}

module.exports = {
  resolveFinalReport
};
