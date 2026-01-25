// === 完全對齊你專案的 Q19Routes.js 最終版 ===

console.log("🔥 Q19 ROUTE FILE LOADED (v3.8 FULL PIPELINE):", __filename);

const express = require("express");

// Core deterministic engine
const { runQ19 } = require("../core/engine/runQ19");

// Pure structural analysis (no language)
const { analyzeQ19ToJSON } = require("../core/analysis/analyzeQ19ToJSON");

// autoSafe MIRAMI v3.8
const { autoSafeSendToMIRAMI } = require("../core/report/autoSafeSendToMIRAMI");

// Structural memory (v1.2)
const { saveQ19Analysis } = require("../core/memory/saveQ19Analysis.v1.2");

// Long-term memory (MEMORY v2)
const { saveQ19Memory } = require("../core/memory/q19MemoryStore");

// Behavior Language Vault
const { writeBehaviorEntry } = require("../core/memory/behaviorVault");

// TRACES v2
const { writeQ19Trace } = require("../core/memory/q19TraceStore");

// A% calculator
const { buildDistribution } = require("../core/q19/distributionBuilder");

/**
 * Validate Q19 payload
 */
function validateQ19Payload(body) {
  const { answers, session_id, started_at } = body || {};

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return { ok: false, reason: "answers must be an object map" };
  }

  if (Object.keys(answers).length === 0) {
    return { ok: false, reason: "answers must not be empty" };
  }

  return {
    ok: true,
    payload: {
      answers,
      session_id: session_id ?? null,
      started_at: started_at ?? null
    }
  };
}

/**
 * Register Q19 Routes
 */
function registerQ19Routes(app) {
  const router = express.Router();

  router.post("/submit", async (req, res) => {
    try {
      /* ─────────────────────────────
         ① Validate payload
      ───────────────────────────── */
      const check = validateQ19Payload(req.body);
      if (!check.ok) {
        return res.status(400).json({ error: check.reason });
      }
      const payload = check.payload;

      /* ─────────────────────────────
         ② Core engine — determine state
      ───────────────────────────── */
      const coreResult = await runQ19(payload);
      const { report_id, state, reliability } = coreResult;

      if (!state) throw new Error("STATE_NOT_RETURNED_FROM_RUNQ19");

      /* ─────────────────────────────
         ③ Structural analysis snapshot
      ───────────────────────────── */
      const analysis = analyzeQ19ToJSON(payload.answers);

      /* ─────────────────────────────
         ④ SLOT ASSEMBLY (STRUCTURE ONLY)
      ───────────────────────────── */
      const slots = analysis.slots;

      /* ─────────────────────────────
         ⑤ FINAL report resolution
      ───────────────────────────── */
      const result = await autoSafeSendToMIRAMI({
        state,
        slots
      });

      /* ─────────────────────────────
         ⑥ Structural memory write (v1.2)
      ───────────────────────────── */
      saveQ19Analysis({
        report_id,
        session_id: payload.session_id,
        state,
        reliability_level: reliability?.level ?? null,
        analysis_snapshot: analysis.snapshot
      });

      /* ─────────────────────────────
         ⑦ A% distribution
      ───────────────────────────── */
      const distribution = buildDistribution(payload.answers);

      /* ─────────────────────────────
         ⑧ Long-term memory (MEMORY v2)
      ───────────────────────────── */
      saveQ19Memory({
        session_id: payload.session_id,
        report_id,
        state,
        answers: payload.answers,
        distribution,
        analysis_snapshot: analysis.snapshot
      });

      /* ─────────────────────────────
         ⑨ Behavior Language Vault
      ───────────────────────────── */
      writeBehaviorEntry({
        state,
        distribution,
        axis_scores: analysis.axis_scores,
        mirami_report: result.content,
        session_id: payload.session_id
      });

      /* ─────────────────────────────
         ⑩ TRACES v2 — full snapshot
      ───────────────────────────── */
      writeQ19Trace({
        session_id: payload.session_id,
        report_id,
        version: "v3.8",
        state,
        answers: payload.answers,
        slots,
        final_report: result.content,
        quality_score: result.quality?.score,
        used_fallback: result.used_fallback,
        attempts: result.attempts,
        scoring: analysis.scoring,
        reliability,
        allowMemory: true,
        signals: analysis.signals,
        deltas: analysis.deltas
      });

      /* ─────────────────────────────
         ⑪ Final response
      ───────────────────────────── */
      return res.json({
        status: "ok",
        report_id,
        final_report: result.content,
        meta: {
          state,
          used_fallback: result.used_fallback
        }
      });

    } catch (err) {
      console.error("[Q19 SUBMIT ERROR]", err);
      return res.status(500).json({
        error: "internal error",
        message: err.message
      });
    }
  });

  app.use("/api/q19", router);
}

module.exports = { registerQ19Routes };