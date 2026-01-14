const crypto = require("crypto");
const { writeQ19Trace } = require("../trace/q19TraceStore");

console.log("🔥 LOADED runQ19 FROM:", __filename);

/**
 * Q19 Core Engine — 28 題版
 * Deterministic
 * Gate only
 * ❌ No language
 * ❌ No report logic
 */
async function runQ19(input = {}) {
  const {
    answers = {},
    session_id = null,
    started_at = null
  } = input;

  const answeredCount = Object.keys(answers).length;

  const reliability = computeReliability(answers);
  const allowMemory = reliability.level !== "low";

  const report_id = crypto.randomUUID();
  console.log("[Q19] run, report_id =", report_id);

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

  // ⭐ 關鍵修正：把 answers 一併往下傳
  return {
    report_id,
    answers,              // ← 新增（非常重要）
    reliability,
    gate: {
      allowMemory
    },
    meta: {
      test_id: "Q19",
      question_count: 28,
      started_at,
      timestamp: new Date().toISOString()
    }
  };
}

/* =========================
   RELIABILITY CHECK（28 題）
========================= */
function computeReliability(answers = {}) {
  const totalAnswered = Object.keys(answers).length;
  let score = 1.0;

  if (totalAnswered < 25) {
    score -= 0.4;
  } else if (totalAnswered < 28) {
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
  return vals.every(v => v === vals[0]);
}

module.exports = {
  runQ19
};
