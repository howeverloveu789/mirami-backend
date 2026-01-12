const crypto = require("crypto");
const { writeQ19Trace } = require("../trace/q19TraceStore");

console.log("🔥 LOADED runQ19 FROM:", __filename);

/**
 * Q19 Core Engine — 27 題版
 * ✅ Deterministic
 * ✅ Gate only
 * ❌ No language
 * ❌ No interpretation
 * ❌ No report knowledge
 *
 * ⚠️ Memory write 已移除（由 q19MemoryStore 統一負責）
 */
async function runQ19(input = {}) {
  const {
    answers = {},
    session_id = null,
    started_at = null
  } = input;

  // ① 作答數量
  const answeredCount = Object.keys(answers).length;

  // ② RELIABILITY GATE（27 題邏輯）
  const reliability = computeReliability(answers);
  const allowMemory = reliability.level !== "low";

  // ③ REPORT ID（⭐ 全系統唯一 anchor）
  const report_id = crypto.randomUUID();
  console.log("[Q19] run, report_id =", report_id);

  // ④ TRACE WRITE（只給 replay / debug 用）
  try {
    writeQ19Trace({
      report_id,
      session_id,
      reliability_level: reliability.level,
      allowMemory,
      answeredCount
    });
  } catch (err) {
    console.error("[Q19 TRACE ERROR]", err);
  }

  // ⑤ CORE RESPONSE（⭐ report_id 必須在最外層）
  return {
    report_id,          // ⭐ 關鍵：後端 / API / 前端唯一來源
    reliability,
    gate: {
      allowMemory
    },
    meta: {
      test_id: "Q19",
      started_at,
      timestamp: new Date().toISOString()
    }
  };
}

/* =========================
   RELIABILITY CHECK（27 題版）
========================= */
function computeReliability(answers = {}) {
  const totalAnswered = Object.keys(answers).length;
  let score = 1.0;

  if (totalAnswered < 24) {
    score -= 0.4;
  } else if (totalAnswered < 27) {
    score -= 0.2;
  }

  if (allSameAnswer(answers)) {
    score -= 0.3;
  }

  if (score < 0) score = 0;

  let level = "high";
  if (score < 0.75) level = "medium";
  if (score < 0.4) level = "low";

  return {
    score: Number(score.toFixed(2)),
    level
  };
}

function allSameAnswer(answers = {}) {
  const vals = Object.values(answers);
  if (vals.length === 0) return false;
  return vals.every((v) => v === vals[0]);
}

module.exports = {
  runQ19
};
