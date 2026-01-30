/**
 * MIRAMI v3.9 — scanPromptForContamination.js
 * Scans MIRAMI JSON prompt files for tone contamination.
 */

const fs = require("fs");
const path = require("path");

function scanPromptForContamination(filePath) {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(filePath)) {
    return { ok: false, errors: ["File not found"], warnings };
  }

  const raw = fs.readFileSync(filePath, "utf8");

  let json;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    return { ok: false, errors: ["Invalid JSON format"], warnings };
  }

  const prompt = json.prompt || "";
  const text = prompt.toLowerCase();

  // -----------------------------
  // Forbidden patterns
  // -----------------------------
  const forbidden = [
    { pattern: /\bshould\b/, label: "Advice language" },
    { pattern: /\byou need\b/, label: "Directive language" },
    { pattern: /\byou must\b/, label: "Directive language" },
    { pattern: /\btry to\b/, label: "Suggestion" },
    { pattern: /\bcope\b/, label: "Therapeutic language" },
    { pattern: /\bheal\b/, label: "Therapeutic language" },
    { pattern: /\bfeel(s|ing)?\b/, label: "Emotional language" },
    { pattern: /\bemotion(s)?\b/, label: "Emotional language" },
    { pattern: /\banxious|sad|angry|upset|fear/, label: "Emotion words" },
    { pattern: /\bprogress\b/, label: "Forward movement" },
    { pattern: /\bimprove\b/, label: "Forward movement" },
    { pattern: /\bget better\b/, label: "Forward movement" },
    { pattern: /\bfix\b/, label: "Forward movement" },
    { pattern: /\bchange\b/, label: "Forward movement" },
    { pattern: /\bwhy\b/, label: "Cause explanation" },
    { pattern: /\bbecause\b/, label: "Cause explanation" },
    { pattern: /\bidentity\b/, label: "Identity labeling" },
    { pattern: /\btrauma\b/, label: "Psychological cause" },
    { pattern: /\binner child\b/, label: "Therapeutic framing" }
  ];

  forbidden.forEach(({ pattern, label }) => {
    if (pattern.test(text)) {
      errors.push(`Forbidden language detected: ${label}`);
    }
  });

  // -----------------------------
  // Soft warnings
  // -----------------------------
  const soft = [
    { pattern: /\bunderstand\b/, label: "Possible interpretive language" },
    { pattern: /\bmeaning\b/, label: "Possible psychological meaning" },
    { pattern: /\bresolve\b/, label: "Possible resolution language" }
  ];

  soft.forEach(({ pattern, label }) => {
    if (pattern.test(text)) {
      warnings.push(`Soft warning: ${label}`);
    }
  });

  return {
    ok: errors.length === 0,
    errors,
    warnings
  };
}

// -----------------------------
// Batch scan a folder
// -----------------------------
function scanPromptFolder(folderPath) {
  const results = {};

  const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".json"));

  files.forEach(file => {
    const full = path.join(folderPath, file);
    results[file] = scanPromptForContamination(full);
  });

  return results;
}

module.exports = {
  scanPromptForContamination,
  scanPromptFolder
};