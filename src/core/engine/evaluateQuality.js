/**
 * MIRAMI v3.8 — State‑Aware Quality Evaluator
 * -------------------------------------------
 * Checks:
 * - SECTION count
 * - RED_FLAG count
 * - duplication
 * - contamination
 * Adds:
 * - state-aware pass/fail threshold
 */

const { validateReportAgainstSpec } = require("../report/validateReportAgainstSpec"); // ★ 修正這一行

function evaluateQuality(text, state) {
  const issues = [];

  if (!text || typeof text !== "string") {
    return { score: 0, issues: ["EMPTY"], pass: false };
  }

  // SECTION / RED_FLAG count
  const sectionCount = (text.match(/SECTION_[1-5]:/g) || []).length;
  const redFlagCount = (text.match(/RED_FLAG_[1-5]:/g) || []).length;

  if (sectionCount !== 5) issues.push("SECTION count incorrect");
  if (redFlagCount !== 5) issues.push("RED_FLAG count incorrect");

  // RED_FLAG duplication
  const redFlags = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^RED_FLAG_\d:\s*(.+)$/);
    if (m) redFlags.push(m[1].trim());
  }
  const unique = new Set(redFlags);
  if (unique.size !== redFlags.length) {
    issues.push("RED_FLAG duplication or missing");
  }

  // contamination
  const contaminationMarkers = ["{{", "}}", "<<", ">>"];
  if (contaminationMarkers.some(m => text.includes(m))) {
    issues.push("BODY contamination");
  }

  // score
  const score = Math.max(0, 30 - issues.length * 6);

  // state-aware threshold
  let threshold = 18;
  if (state === "C") threshold = 24;

  const pass = score >= threshold;

  return { score, issues, pass };
}

module.exports = { evaluateQuality };
