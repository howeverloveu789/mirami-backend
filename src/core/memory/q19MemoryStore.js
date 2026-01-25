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

function getLastRunIndex(session_id) {
  if (!fs.existsSync(FILE)) return 0;

  const lines = fs.readFileSync(FILE, "utf-8")
    .trim()
    .split("\n")
    .filter(Boolean);

  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const r = JSON.parse(lines[i]);
      if (r.session_id === session_id && Number.isInteger(r.run_index)) {
        return r.run_index;
      }
    } catch (_) {}
  }
  return 0;
}

function saveQ19Memory(input = {}) {
  ensureDir();

  if (!["A", "B", "C"].includes(input.state)) {
    throw new Error("INVALID_Q19_STATE");
  }

  const runIndex = Number.isInteger(input.run_index)
    ? input.run_index
    : (input.session_id ? getLastRunIndex(input.session_id) + 1 : null);

  const record = {
    memory_id: crypto.randomUUID(),
    test_id: "Q19",

    session_id: input.session_id ?? null,
    report_id: input.report_id ?? null,

    state: input.state,
    answers: input.answers ?? null,
    distribution: input.distribution ?? null,

    run_index: runIndex,
    visit_type:
      runIndex === 1 ? "first" :
      Number.isInteger(runIndex) ? "return" :
      null,

    analysis_snapshot: input.analysis_snapshot ?? null,

    created_at: new Date().toISOString()
  };

  fs.appendFileSync(FILE, JSON.stringify(record) + "\n", "utf-8");
  return record;
}

module.exports = { saveQ19Memory };