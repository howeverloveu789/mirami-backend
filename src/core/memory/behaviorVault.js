/**
 * MIRAMI Behavior Language Vault (v1)
 * -----------------------------------
 * Purpose:
 *   Store MIRAMI-generated mirror language + Q19 structural signals.
 *
 * Boundaries:
 *   - No analysis
 *   - No scoring beyond Q19's own numbers
 *   - No interpretation
 *   - No rewriting of MIRAMI output
 *   - Append-only
 */

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// JSONL file path (one entry per line)
const VAULT_PATH = path.join(__dirname, "../../data/behavior_vault.jsonl");

// Ensure directory exists before writing
function ensureDir() {
  const dir = path.dirname(VAULT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Write one behavior language entry
 *
 * @param {Object} payload
 * @param {string} payload.state - "A" | "B" | "C"
 * @param {Object} payload.distribution - { A: number, B: number, C: number }
 * @param {Object} payload.axis_scores - 9-axis numeric structure
 * @param {string|Object} payload.mirami_report - full MIRAMI report (string or structured)
 * @param {Object} payload.feedback - { most_accurate, most_weird }
 * @param {string} payload.session_id - optional
 */
function writeBehaviorEntry(payload) {
  try {
    if (!payload || typeof payload !== "object") {
      // hard fail is worse than skipping one entry
      return;
    }

    ensureDir();

    const entry = {
      vault_version: "blv1",
      id: uuidv4(),
      created_at: new Date().toISOString(),

      // Structural signals
      state: payload.state || null,
      distribution: payload.distribution || null,
      axis_scores: payload.axis_scores || null,

      // Mirror language (MIRAMI output)
      mirami_report: payload.mirami_report || null,

      // User feedback (optional)
      feedback: payload.feedback || {
        most_accurate: null,
        most_weird: null
      },

      // Optional session grouping
      session_id: payload.session_id || null
    };

    // Append to JSONL (one line per entry)
    fs.appendFileSync(VAULT_PATH, JSON.stringify(entry) + "\n");
    return entry;
  } catch (err) {
    // Vault 不能影響主流程，錯了就記 log，不 throw
    console.error("[BehaviorVault] writeBehaviorEntry error:", err);
    return null;
  }
}

module.exports = {
  writeBehaviorEntry
};