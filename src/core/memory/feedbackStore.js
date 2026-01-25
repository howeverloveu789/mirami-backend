// src/core/memory/feedbackStore.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_DIR = path.join(__dirname, "../../../data");
const FILE = path.join(DATA_DIR, "q19_feedback.jsonl");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * FEEDBACK v1 — User subjective feedback
 * Does NOT affect MIRAMI logic
 */
function saveQ19Feedback(input = {}) {
  ensureDir();

  const record = {
    feedback_id: crypto.randomUUID(),
    session_id: input.session_id ?? null,
    report_id: input.report_id ?? null,

    most_accurate: input.most_accurate ?? null,
    least_accurate: input.least_accurate ?? null,
    helpfulness: input.helpfulness ?? null, // 1–5
    comment: input.comment ?? null,

    created_at: new Date().toISOString()
  };

  fs.appendFileSync(FILE, JSON.stringify(record) + "\n", "utf-8");
  return record;
}

module.exports = { saveQ19Feedback };