/**
 * Q19 deterministic engine (v4.1)
 * - Pure logic
 * - No language
 * - No interpretation
 * - No side effects
 */

function runEngine(payload = {}) {
  const answers = payload.answers || {};

  // Count A/B/C
  let A = 0, B = 0, C = 0;
  for (const key of Object.keys(answers)) {
    const v = answers[key];
    if (v === "A") A++;
    else if (v === "B") B++;
    else if (v === "C") C++;
  }

  // Determine state
  let state = null;
  if (A >= B && A >= C) state = "A";
  else if (B >= A && B >= C) state = "B";
  else state = "C";

  return {
    report_id: "q19_" + Date.now(),
    state,
    reliability: { level: "normal" }
  };
}

module.exports = { runEngine };
