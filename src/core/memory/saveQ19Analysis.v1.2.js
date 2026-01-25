// === 完全對齊你專案的 saveQ19Analysis.v1.2.js 最終版 ===

const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../../../data/q19_analysis.jsonl");

function saveQ19Analysis({ session_id, report_id, state, analysis_snapshot, reliability_level }) {
  const entry = {
    timestamp: Date.now(),
    session_id,
    report_id,
    state,
    reliability_level,
    snapshot: analysis_snapshot
  };

  const line = JSON.stringify(entry) + "\n";
  fs.appendFile(FILE, line, err => {
    if (err) console.error("Failed to write q19_analysis:", err);
  });
}

module.exports = { saveQ19Analysis };