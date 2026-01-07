// src/api/q19Feedback.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_DIR = path.join(__dirname, "../../data");
const FEEDBACK_FILE = path.join(DATA_DIR, "q19_feedback.jsonl");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

function registerQ19Feedback(app) {
  app.post("/q19/feedback", (req, res) => {
    const record = {
      feedback_id: crypto.randomUUID(),
      report_id: req.body.report_id,
      rating: req.body.rating,
      comment: req.body.comment || "",
      created_at: new Date().toISOString()
    };

    fs.appendFileSync(FEEDBACK_FILE, JSON.stringify(record) + "\n");

    res.json({ ok: true });
  });
}

module.exports = { registerQ19Feedback };
