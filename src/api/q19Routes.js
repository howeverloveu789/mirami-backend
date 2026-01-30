// ⭐ MIRAMI QA checker
const { validateReportAgainstSpec } = require("../core/report/validateReportAgainstSpec");

console.log("🔥 Q19 ROUTE FILE LOADED (v4.1 FULL PIPELINE):", __filename);

const express = require("express");

// Engine index (runEngine included)
const Engine = require("../core/engine");

// Pure structural analysis
const { analyzeQ19ToJSON } = require("../core/analysis/analyzeQ19ToJSON");

// autoSafe MIRAMI v4.1
const { autoSafeSendToMIRAMI } = require("../core/report/autoSafeSendToMIRAMI");

// Structural memory
const { saveQ19Analysis } = require("../core/memory/saveQ19Analysis.v1.2");

// Long-term memory
const { saveQ19Memory } = require("../core/memory/q19MemoryStore");

// Behavior Language Vault
const { writeBehaviorEntry } = require("../core/memory/behaviorVault");

// TRACES v2
const { writeQ19Trace } = require("../core/memory/q19TraceStore");

// A% calculator
const { buildDistribution } = require("../core/q19/distributionBuilder");

// MIRAMI routing map
const MIRAMI_ROUTING_MAP = require("../core/report/MIRAMI_ROUTING_MAP");


// ------------------------------
// Validate Q19 payload
// ------------------------------
function validateQ19Payload(body) {
  const { answers, session_id, started_at, module } = body || {};

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
      started_at: started_at ?? null,
      module: module ?? "q19_free_a"
    }
  };
}


// ------------------------------
// Register Q19 Routes
// ------------------------------
function registerQ19Routes(app) {
  const router = express.Router();

  router.post("/submit", async (req, res) => {
    try {
      // ① Validate payload
      const check = validateQ19Payload(req.body);
      if (!check.ok) {
        return res.status(400).json({ error: check.reason });
      }
      const payload = check.payload;

      // ② Determine MIRAMI module
      const moduleKey = payload.module.toLowerCase();
      const moduleConfig = MIRAMI_ROUTING_MAP[moduleKey];

      if (!moduleConfig) {
        return res.status(400).json({
          error: `Invalid MIRAMI module: ${moduleKey}`
        });
      }

      // ③ Core engine — determine state
      const coreResult = await Engine.run(payload);
      const { report_id, state, reliability } = coreResult;

      if (!state) throw new Error("STATE_NOT_RETURNED_FROM_RUNENGINE");

      // ④ Structural analysis snapshot
      const analysis = analyzeQ19ToJSON(payload.answers);

      // ⑤ SLOT ASSEMBLY
      const slots = analysis.slots;

      // ⑥ MIRAMI v4.1
      const result = await autoSafeSendToMIRAMI({
        state,
        slots,
        moduleFile: moduleConfig.file,
        layer: moduleConfig.layer,
        angle: moduleConfig.angle
      });

      // ⑦ QA
      const qa = validateReportAgainstSpec(result.content);

      result.quality = {
        score: qa.ok ? 1 : 0,
        errors: qa.errors,
        warnings: qa.warnings
      };

      // ⑧ Structural memory
      saveQ19Analysis({
        report_id,
        session_id: payload.session_id,
        state,
        reliability_level: reliability?.level ?? null,
        analysis_snapshot: analysis.snapshot
      });

      // ⑨ A% distribution
      const distribution = buildDistribution(payload.answers);

      // ⑩ Long-term memory
      saveQ19Memory({
        session_id: payload.session_id,
        report_id,
        state,
        answers: payload.answers,
        distribution,
        analysis_snapshot: analysis.snapshot
      });

      // ⑪ Behavior Language Vault
      writeBehaviorEntry({
        state,
        distribution,
        axis_scores: analysis.axis_scores,
        mirami_report: result.content,
        session_id: payload.session_id
      });

      // ⑫ TRACES v2
      writeQ19Trace({
        session_id: payload.session_id,
        report_id,
        version: "v4.1",
        state,
        answers: payload.answers,
        slots,
        final_report: result.content,
        quality_score: result.quality?.score,
        quality_errors: result.quality?.errors,
        quality_warnings: result.quality?.warnings,
        used_fallback: result.used_fallback,
        attempts: result.attempts,
        scoring: analysis.scoring,
        reliability,
        allowMemory: true,
        signals: analysis.signals,
        deltas: analysis.deltas,
        module: moduleKey
      });

      // ⑬ Final response
      return res.json({
        status: "ok",
        report_id,
        final_report: result.content,
        meta: {
          state,
          used_fallback: result.used_fallback,
          module: moduleKey
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
