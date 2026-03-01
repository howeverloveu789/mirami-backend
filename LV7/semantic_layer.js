// LV7/semantic_layer.js

function normalize(vec) {
  const total = Object.values(vec).reduce((a,b)=>a+Math.abs(b),0);
  if (total === 0) return vec;
  const out = {};
  for (let k in vec) out[k] = vec[k] / total;
  return out;
}

function computeDominance(norm) {
  return {
    RESET_LOOP:
      norm.L6 * 0.4 + norm.L7 * 0.4 - norm.L1 * 0.2,

    PIVOT_REFLEX:
      norm.L4 * 0.5 + norm.L3 * 0.2 - norm.L1 * 0.3,

    COMPRESSION_ACCUMULATOR:
      norm.L3 * 0.6 - norm.L5 * 0.3,

    STRUCTURAL_OVER_OPTIMIZER:
      norm.L1 * 0.4 + norm.L4 * 0.3 - norm.L3 * 0.2,

    STABILITY_EROSION:
      -norm.L1 * 0.5 + norm.L4 * 0.3,

    FREQUENCY_DRIFT:
      norm.L4 * 0.4 + norm.L2 * 0.3,

    INTERNAL_WITHDRAWAL:
      -norm.L2 * 0.4 + norm.L6 * 0.3,

    RESILIENT_REBUILDER:
      norm.L6 * 0.3 + norm.L7 * 0.4 - norm.L3 * 0.2
  };
}

export function semanticLayer(engine) {
  const norm = normalize(engine.vector_sum);
  const scores = computeDominance(norm);

  const primary = Object.keys(scores)
    .reduce((a,b)=>scores[a] > scores[b] ? a : b);

  const supporting_signals = {
    stability_pattern:
      engine.stability_window.L3 > 0.5 ? "narrow_window" :
      engine.stability_window.L3 < 0.2 ? "wide_window" :
      "adaptive_window",

    compensation_style:
      engine.compensation_state === "COMP_ACTIVE" ? "early_activation" :
      engine.compensation_state === "COMP_COLLAPSED" ? "late_or_failed" :
      "background",

    friction_behavior:
      engine.temporal_resistance.L1 + engine.temporal_resistance.L7 < -0.6
        ? "high"
        : "moderate"
  };

  const collapse_model = {
    trigger_condition:
      engine.transition_condition === "TRANSITION_ACTIVE"
        ? "state_shift_under_load"
        : "accumulated_strain",

    distortion_path: [
      primary,
      engine.failure_mechanism
    ].filter(Boolean),

    failure_threshold:
      engine.break_pattern.L3 + engine.break_pattern.L4 > 1.0
        ? "low_threshold"
        : "medium_threshold"
  };

  return {
    primary_core: primary,
    supporting_signals,
    collapse_model
  };
}
