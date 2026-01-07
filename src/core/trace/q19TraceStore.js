// src/core/trace/q19TraceStore.js
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
    report_id: input.report_id,
    session_id: input.session_id || null,

    // ⬇️ 核心：系統是怎麼想的
    scoring: input.scoring || {},
    reliability: input.reliability || {},
    gate: {
      allowMemory: input.allowMemory
    },

    // ⬇️ 靜態行為結果（來自 B1）
    signals: input.signals || {},
    deltas: input.deltas || {},

    created_at: new Date().toISOString()
  };

  fs.appendFileSync(FILE, JSON.stringify(record) + "\n", "utf-8");
}

module.exports = {
  writeQ19Trace
};
