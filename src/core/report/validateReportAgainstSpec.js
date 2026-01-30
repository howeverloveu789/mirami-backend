/**
 * MIRAMI v4.0 — Tier‑Aware Report Validator
 * 適用：free / lite / 19 / 49 / 79 / full
 */

function validateReportAgainstSpec(reportText = "", tier = "free") {
  const errors = [];
  const warnings = [];

  if (!reportText || typeof reportText !== "string") {
    return { ok: false, errors: ["Empty or invalid report text"], warnings };
  }

  const text = reportText.trim();

  // -----------------------------------------
  // 1. Forbidden language (universal)
  // -----------------------------------------
  const forbiddenPatterns = [
    { pattern: /\bshould\b/i, label: "Advice language" },
    { pattern: /\byou need\b/i, label: "Directive language" },
    { pattern: /\byou must\b/i, label: "Directive language" },
    { pattern: /\btry to\b/i, label: "Suggestion" },
    { pattern: /\bcope\b/i, label: "Therapeutic language" },
    { pattern: /\bheal\b/i, label: "Therapeutic language" },
    { pattern: /\bfeel(s|ing)?\b/i, label: "Emotional language" },
    { pattern: /\bemotion(s)?\b/i, label: "Emotional language" },
    { pattern: /\banxious|sad|angry|upset|fear/i, label: "Emotion words" },
    { pattern: /\bprogress\b/i, label: "Forward movement" },
    { pattern: /\bimprove\b/i, label: "Forward movement" },
    { pattern: /\bget better\b/i, label: "Forward movement" },
    { pattern: /\bfix\b/i, label: "Forward movement" },
    { pattern: /\bchange\b/i, label: "Forward movement" },
    { pattern: /\bidentity\b/i, label: "Identity labeling" }
  ];

  forbiddenPatterns.forEach(({ pattern, label }) => {
    if (pattern.test(text)) {
      errors.push(`Forbidden language detected: ${label}`);
    }
  });

  // -----------------------------------------
  // 2. Required sections by tier
  // -----------------------------------------
  const REQUIRED_BY_TIER = {
    free: ["SECTION_1"],
    lite: ["SECTION_1", "SECTION_2", "SECTION_3"],
    19: ["SECTION_1", "SECTION_2", "SECTION_3", "SECTION_4"],
    49: ["SECTION_1", "SECTION_2", "SECTION_3", "SECTION_4"],
    79: ["SECTION_1", "SECTION_2", "SECTION_3", "SECTION_4"],
    full: [
      "SECTION_1",
      "SECTION_2",
      "SECTION_3",
      "SECTION_4",
      "SECTION_5",
      "RED_FLAG_1",
      "RED_FLAG_2",
      "RED_FLAG_3",
      "RED_FLAG_4",
      "RED_FLAG_5"
    ]
  };

  const requiredSections = REQUIRED_BY_TIER[tier] || REQUIRED_BY_TIER["free"];

  requiredSections.forEach((section) => {
    if (!text.includes(section)) {
      errors.push(`Missing required section: ${section}`);
    }
  });

  // -----------------------------------------
  // 3. Mirror stop (no resolution)
  // -----------------------------------------
  const resolutionPatterns = [
    /\btherefore\b/i,
    /\bas a result\b/i,
    /\bso that\b/i,
    /\bthis allows\b/i,
    /\bthis helps\b/i,
    /\bthis leads to\b/i
  ];

  resolutionPatterns.forEach((pattern) => {
    if (pattern.test(text)) {
      errors.push("Mirror stop violation: resolution or causal chain detected");
    }
  });

  // -----------------------------------------
  // 4. Paragraph function check (FULL ONLY)
  // -----------------------------------------
  if (tier === "full") {
    const paragraphs = text.split(/\n\s*\n/);

    paragraphs.forEach((p, index) => {
      const lower = p.toLowerCase();

      const hasPositioning =
        lower.includes("tends to") ||
        lower.includes("typically") ||
        lower.includes("is positioned") ||
        lower.includes("stands in");

      const hasScene =
        lower.includes("appears as") ||
        lower.includes("shows up as") ||
        lower.includes("presents as");

      const hasLoad =
        lower.includes("this creates") ||
        lower.includes("this results in") ||
        lower.includes("this adds") ||
        lower.includes("this produces");

      if (!hasPositioning && !hasScene && !hasLoad) {
        warnings.push(
          `Paragraph ${index + 1} may not map to a structural function`
        );
      }
    });
  }

  // -----------------------------------------
  // Final result
  // -----------------------------------------
  return {
    ok: errors.length === 0,
    errors,
    warnings
  };
}

module.exports = { validateReportAgainstSpec };
