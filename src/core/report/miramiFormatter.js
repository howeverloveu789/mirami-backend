// === 完全對齊你專案的 miramiFormatter.js 最終版 ===

/**
 * MIRAMI Report Formatter (v3.8)
 * - Splits SECTION_x and RED_FLAG_x
 * - Returns structured JSON
 */

function formatMiramiReport(text = "") {
  const sections = {};
  const flags = {};

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  let current = null;

  for (const line of lines) {
    if (line.startsWith("SECTION_")) {
      current = line.replace(":", "");
      sections[current] = "";
      continue;
    }

    if (line.startsWith("RED_FLAG_")) {
      current = line.replace(":", "");
      flags[current] = "";
      continue;
    }

    if (current) {
      if (current.startsWith("SECTION_")) {
        sections[current] += line + " ";
      } else if (current.startsWith("RED_FLAG_")) {
        flags[current] = line;
      }
    }
  }

  return {
    sections,
    red_flags: flags
  };
}

module.exports = { formatMiramiReport };