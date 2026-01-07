// src/core/memory/q19TraceStore.js
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../../../data");
const FILE = path.join(DATA_DIR, "q19_traces.jsonl");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Q19 Trace Writer
 * - ALWAYS WRITE
 * - NO GATE
 * - REPLAYABLE
 */
function writeQ19Trace(input = {}) {
  ensureDir();

  const record = {
    trace_at: new Date().toISOString(),
    report_id: input.report_id || null,
    session_id: input.session_id || null,
    reliability_level: input.reliability_level || "unknown",
    allowMemory: Boolean(input.allowMemory),
    answeredCount: input.answeredCount ?? null
  };

  fs.appendFileSync(FILE, JSON.stringify(record) + "\n", "utf-8");
}

module.exports = {
  writeQ19Trace
};
