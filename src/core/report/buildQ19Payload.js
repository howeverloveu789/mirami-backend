// src/core/report/buildQ19Payload.js

const { enforceReliabilityGate } = require("../rules/q19_reliability_rules");

/**
 * Build Q19 Payload for MIRAMI Mirror
 *
 * Responsibilities:
 * - Package Q19 state only
 * - Enforce reliability boundaries
 * - Do NOT inject narrative logic
 *
 * Narrative authority lives ONLY in:
 * - prompts/VARO_system_prompt.txt
 */

function buildQ19Payload(
  memoryRecord = {},
  analysisJSON = null,
  reliability = null
) {
  if (!memoryRecord) return null;

  // --- Core observed state (single source of truth) ---
  const q19_axis = analysisJSON || null;

  // --- Reliability handling ---
  const rel = reliability || { level: "medium", score: 0.5 };
  const gate = enforceReliabilityGate(rel);

  const analysis_mode = gate.allowFullAnalysis ? "full" : "restricted";

  // Sections are advisory only; VARO decides what to express
  const allowedSections =
    analysis_mode === "full"
      ? [
          "mirror_layer",
          "causal_layer",
          "navigation_layer",
          "traffic_light",
          "core_signals",
          "deep_insights"
        ]
      : [];

  return {
    // --- Traceable metadata (non-narrative) ---
    meta: {
      test_id: "Q19",
      report_id: memoryRecord.report_id,
      session_id: memoryRecord.session_id,
      generated_at: new Date().toISOString(),
      source: "MIRAMI_Q19_CORE"
    },

    // --- Observed evidence only ---
    evidence: {
      core: {
        q19_axis
      },
      auxiliary: {
        // Legacy / transitional flags only
        core_flags: memoryRecord.core_flags || null
      },
      qualitative: null,
      control: null
    },

    // --- Memory quality context (NOT interpretation) ---
    memory_quality: {
      reliability_level: rel.level,
      data_completeness:
        memoryRecord.data_completeness || "unknown",
      usable_for_reporting: true
    },

    // --- Reliability gate for mirror engine ---
    reliability: {
      level: rel.level,
      score: rel.score,
      analysis_mode,
      allowedSections
    }
  };
}

module.exports = {
  buildQ19Payload
};
