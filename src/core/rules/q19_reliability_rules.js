/**
 * Q19 Reliability Gate Rules (Mirror-aligned)
 *
 * Purpose:
 * - Prevent over-interpretation under weak signals
 * - Control DEPTH, not existence, of reflection
 * - Reliability gates HOW MUCH is named, not WHETHER we speak
 *
 * All rules are system-level and cannot be overridden by prompt.
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
      allowedSections: [
        "mirror_layer",
        "causal_layer",
        "navigation_layer",
        "traffic_light",
        "core_signals",
        "deep_insights"
      ],
      depth: "full",
      notice: null
    };
  }

  // === MEDIUM RELIABILITY ===
  if (level === "medium") {
    return {
      allowFullAnalysis: true,
      allowedSections: [
        "mirror_layer",
        "traffic_light",
        "core_signals",
        "deep_insights"
      ],
      depth: "surface",
      notice: "Signals are present but lightly differentiated in this sitting."
    };
  }

  // === LOW RELIABILITY ===
  return {
    allowFullAnalysis: true,
    allowedSections: [
      "mirror_layer",
      "traffic_light"
    ],
    depth: "minimal",
    notice:
      "This sitting does not form strong distinctions. The mirror reflects only what is clearly present."
  };
}

module.exports = { enforceReliabilityGate };
