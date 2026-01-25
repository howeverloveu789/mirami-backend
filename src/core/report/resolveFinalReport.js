// src/report/resolveFinalReport.js
console.log("🔥 RESOLVE_FINAL_REPORT_FILE_LOADED (Q19 LOCKED)");

const { sendToMIRAMI } = require("./sendToMIRAMI");
const { saveQ19Analysis } =
  require("../memory/saveQ19Analysis.v1");

/**
 * Q19 FINAL RESOLVER
 * - No language assembly
 * - No context expansion
 * - No interpretation
 * - Delegates ALL language to MIRAMI
 */
async function resolveFinalReport(payload) {
  const {
    answers,            // kept for interface compatibility
    currentState,       // A / B / C (single source of truth)
    session_id,
    report_id,
    reliability_level,
    slots               // ← NEW: explicit slots passed through
  } = payload;

  if (!currentState) {
    throw new Error("Q19 resolveFinalReport: currentState missing");
  }

  // 🔒 HARD GUARD — state must be A / B / C
  if (!["A", "B", "C"].includes(currentState)) {
    throw new Error(
      `Q19 resolveFinalReport: invalid state "${currentState}"`
    );
  }

  // 🔒 HARD GUARD — slots must exist (even if minimal)
  if (!slots || typeof slots !== "object") {
    throw new Error("Q19 resolveFinalReport: slots missing");
  }

  /* ─────────────────────────────
     ① Language: MIRROR ONLY
     - BODY + RED FLAG handled internally
     - No language allowed here
  ───────────────────────────── */

  const miramiResult = await sendToMIRAMI({
    state: currentState, // ✅ FIXED: correct param name
    slots
  });

  /* ─────────────────────────────
     ② Memory: STRUCTURE ONLY
     - No language stored
  ───────────────────────────── */

  saveQ19Analysis({
    session_id,
    report_id,
    state: currentState,
    reliability_level: reliability_level ?? null
  });

  return {
    mode: "mirami",
    final_report: miramiResult.content,
    meta: {
      state: currentState,
      used_fallback: false
    }
  };
}

module.exports = { resolveFinalReport };
