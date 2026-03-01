const fs = require("fs");
const path = require("path");

// -----------------------------
// Load Data
// -----------------------------
const answers = JSON.parse(fs.readFileSync(path.join(__dirname, "answers.json"), "utf8"));
const modules = JSON.parse(fs.readFileSync(path.join(__dirname, "modules.json"), "utf8")).modules;
const F_core = require("./F_core.js");
const dark_patterns = require("./dark_patterns.js");

// -----------------------------
// Accumulators for L1–L4
// -----------------------------
let L1 = 0;
let L2 = 0;
let L3 = 0;
let L4 = 0;

// Shadow / Dark counters
let shadowCount = {};
let darkCount = {};

// -----------------------------
// Process Answers
// -----------------------------
answers.forEach((ans) => {
  const qIndex = parseInt(ans.id.replace("Q", ""), 10) - 1;
  const module = modules[qIndex];
  if (!module) return;

  const opt = module.options[ans.value];
  if (!opt) return;

  // Accumulate vectors
  const vec = opt.vector || {};
  L1 += vec.L1 || 0;
  L2 += vec.L2 || 0;
  L3 += vec.L3 || 0;
  L4 += vec.L4 || 0;

  // Count shadow
  if (opt.shadow) {
    shadowCount[opt.shadow] = (shadowCount[opt.shadow] || 0) + 1;
  }

  // Count dark patterns
  if (opt.dark) {
    darkCount[opt.dark] = (darkCount[opt.dark] || 0) + 1;
  }
});

// -----------------------------
// Helper Functions
// -----------------------------
const sign = (v) => (v > 0 ? "positive" : v < 0 ? "negative" : "neutral");
const maxKey = (obj) => {
  let max = null;
  let maxVal = -Infinity;
  for (let k in obj) {
    if (obj[k] > maxVal) {
      maxVal = obj[k];
      max = k;
    }
  }
  return max || "none";
};

// -----------------------------
// Mapping L1–L4 → Founder OS JSON
// -----------------------------

// tension layer
const tension_threshold = L1;
const stability_window = -L1;

const friction_map = {
  task: L1 * 0.4,
  social: L1 * 0.3,
  decision: L1 * 0.3,
};

// shift direction layer
const shift_direction = sign(L2);

const stage_fit = {
  explore: Math.max(0, L2),
  mvp: Math.max(0, -L2),
  pressure: L3,
  scale: Math.max(0, L4),
};

// shift velocity layer
const shift_velocity = Math.abs(L3);

// cross-state transitions
const cross_state = {
  stable_to_pressure: L3 > 0.3 ? "open" : "closed",
  pressure_to_shift: shadowCount["OUTER_SIGNAL"] > 0 ? "open" : "closed",
  shift_to_failure: Object.keys(darkCount).length > 0 ? "open" : "closed",
  failure_to_recovery: shadowCount["INNER_WITHDRAW"] > 0 ? "open" : "closed",
};

// failure / reboot layer
const failure_mode = sign(L4);
const reboot_type = L4 > 0 ? "cold" : "warm";
const compensation_loop = Math.abs(L4);

// threshold signals
const threshold_signals = maxKey(shadowCount);

// -----------------------------
// Final Output
// -----------------------------
const output = {
  tension_threshold,
  shift_direction,
  shift_velocity,
  failure_mode,
  reboot_type,
  stability_window,
  compensation_loop,
  friction_map,
  stage_fit,
  cross_state,
  threshold_signals,
};

fs.writeFileSync(path.join(__dirname, "../LV7/data/os.json"), JSON.stringify(output, null, 2), "utf8");

console.log("LV6 compute complete → os.json updated.");
