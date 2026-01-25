const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_DIR = path.join(__dirname, "../../../data");
const FILE = path.join(DATA_DIR, "q19_traces.jsonl");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function writeQ19Trace(input = {}) {
  ensureDir();

  const record = {
    trace_id: "trace_" + crypto.randomUUID(),
    test_id: "Q19",

    session_id: input.session_id ?? null,
    report_id: input.report_id ?? null,
    version: input.version ?? "v3.8",

    state: input.state ?? null,
    answers: input.answers ?? null,
    slots: input.slots ?? null,

    final_report: input.final_report ?? null,
    quality_score: input.quality_score ?? null,
    used_fallback: Boolean(input.used_fallback),
    attempts: input.attempts ?? null,

    scoring: input.scoring ?? {},
    reliability: input.reliability ?? {},
    gate: { allowMemory: input.allowMemory ?? null },

    signals: input.signals ?? {},
    deltas: input.deltas ?? {},

    error: input.error ?? null,

    created_at: new Date().toISOString()
  };

  fs.appendFileSync(FILE, JSON.stringify(record) + "\n", "utf-8");
  return record;
}

module.exports = { writeQ19Trace };