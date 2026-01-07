// src/core/engine/runQ19.js
const crypto = require("crypto");

/**
 * ⚠️ 路徑已確認
 * engine → analysis / memory / trace 都是同層
 */
const { analyzeQ19Signals } = require("../analysis/q19SignalAnalyzer");
const { writeQ19Memory } = require("../memory/q19MemoryStore");
const { writeQ19Trace } = require("../trace/q19TraceStore");

// 🔥 用來確認 Node 真正載入的是哪一份
console.log("🔥 LOADED runQ19 FROM:", __filename);

/**
 * Q19 Core Engine — Phase B1 (STABLE)
 * ❌ No GPT
 * ❌ No language
 * ✅ Deterministic
 * ✅ Static signals
 * ✅ Memory + Trace (safe)
 */
async function runQ19(input = {}) {
  const {
    answers = {},
    session_id = null,
    started_at = null
  } = input;

  /* =========================
     ① SCORING (minimal)
  ========================= */
  const scoring = {
    answeredCount: Object.keys(answers).length
  };

  /* =========================
     ② RELIABILITY (gate)
  ========================= */
  const reliability = computeReliability(answers);

  /* =========================
     ③ DECISION GATE
  ========================= */
  const allowMemory = reliability.level !== "low";

  /* =========================
     ④ REPORT ID (global anchor)
  ========================= */
  const report_id = crypto.randomUUID();

  console.log("[Q19] writing memory", report_id);

  /* =========================
     ⑤ STATIC SIGNAL ANALYSIS
     (pure / deterministic)
  ========================= */
  let signals = {};
  let deltas = {};

  if (allowMemory) {
    try {
      const analysis = analyzeQ19Signals({
        answers,
        scoring,
        reliability
      });

      signals = analysis.signals || {};
      deltas = analysis.deltas || {};

      writeQ19Memory({
        report_id,
        session_id,
        reliability_level: reliability.level,
        signals,
        deltas,
        created_at: new Date().toISOString()
      });
    } catch (err) {
      // ⚠️ memory / analysis failure must NEVER break core
      console.error("[Q19 MEMORY ERROR]", err);
    }
  }

  /* =========================
     ⑥ TRACE WRITE (B2)
     - replayable
     - safe
  ========================= */
  try {
    writeQ19Trace({
      report_id,
      session_id,
      reliability_level: reliability.level,
      allowMemory,
      answeredCount: scoring.answeredCount
    });
  } catch (err) {
    console.error("[Q19 TRACE ERROR]", err);
  }

  /* =========================
     ⑦ CORE RESPONSE
  ========================= */
  return {
    meta: {
      test_id: "Q19",
      report_id,
      started_at,
      timestamp: new Date().toISOString()
    },
    scoring,
    reliability,
    report: {
      state: "core-b1",
      allowMemory
    }
  };
}

/* =========================
   RELIABILITY CHECK (v1)
========================= */
function computeReliability(answers = {}) {
  let score = 1.0;

  // Q92: must be disagree
  if (answers.q92 && answers.q92 !== "disagree") {
    score -= 0.4;
  }

  // Q94: should be skipped
  if (answers.q94) {
    score -= 0.2;
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

module.exports = {
  runQ19
};
