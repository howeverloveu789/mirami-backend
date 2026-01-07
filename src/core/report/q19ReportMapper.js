// src/core/report/q19ReportMapper.js

/**
 * Q19 Report Mapper — B4
 * ❌ No language
 * ❌ No advice
 * ❌ No pricing
 * ✅ Spec-locked
 */

function mapQ19Report({ signals = {}, deltas = {}, reliability = {} }) {
  const blocks = [];

  // Rhythm block
  if (signals.rhythm_type) {
    blocks.push({
      id: "rhythm",
      type: "behavior-pattern",
      tags: ["rhythm"],
      level: signals.rhythm_type === "fast-switch" ? "warning" : "info",
      priority: 2,
      data: {
        rhythm_type: signals.rhythm_type
      }
    });
  }

  // Control block
  if (signals.control_style) {
    blocks.push({
      id: "control",
      type: "behavior-pattern",
      tags: ["control"],
      level: signals.control_style === "over-optimize" ? "warning" : "info",
      priority: 1,
      data: {
        control_style: signals.control_style
      }
    });
  }

  // Stress block
  if (signals.stress_response) {
    blocks.push({
      id: "stress",
      type: "behavior-pattern",
      tags: ["stress"],
      level: "info",
      priority: 3,
      data: {
        stress_response: signals.stress_response
      }
    });
  }

  // Stability / delta block
  if (deltas && Object.keys(deltas).length > 0) {
    blocks.push({
      id: "stability",
      type: "stability",
      tags: ["delta"],
      level: "info",
      priority: 4,
      data: {
        contradiction_count: deltas.contradiction_count || 0,
        extreme_switch: deltas.extreme_switch === true
      }
    });
  }

  return {
    blocks,
    meta: {
      reliability_level: reliability.level || "unknown",
      engine_version: "q19-b4-v1"
    }
  };
}

module.exports = {
  mapQ19Report
};
