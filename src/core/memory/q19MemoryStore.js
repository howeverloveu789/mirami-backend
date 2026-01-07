// src/core/memory/q19MemoryStore.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_DIR = path.join(__dirname, "../../../data");
const FILE = path.join(DATA_DIR, "q19_memory.jsonl");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function writeQ19Memory(input = {}) {
  ensureDir();

  const record = {
    memory_id: "mem_" + crypto.randomUUID(),
    test_id: "Q19",
    report_id: input.report_id || null,
    session_id: input.session_id || null,
    reliability_level: input.reliability_level || "unknown",
    signals: input.signals || {},
    deltas: input.deltas || {},
    created_at: new Date().toISOString()
  };

  fs.appendFileSync(FILE, JSON.stringify(record) + "\n", "utf-8");
}

module.exports = {
  writeQ19Memory
};
