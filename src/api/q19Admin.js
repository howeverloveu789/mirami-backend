// === 完全對齊你專案的 q19Admin.js 最終版 ===

const fs = require("fs");
const path = require("path");

const MEMORY_FILE = path.join(__dirname, "../../data/q19_memory.jsonl");
const TRACE_FILE = path.join(__dirname, "../../data/q19_traces.jsonl");

function loadJSONL(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf-8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map(l => JSON.parse(l));
}

function registerAdminRoutes(app) {
  app.get("/api/q19/admin/memory", (req, res) => {
    try {
      const data = loadJSONL(MEMORY_FILE);
      res.json({ status: "ok", memory: data });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  });

  app.get("/api/q19/admin/traces", (req, res) => {
    try {
      const data = loadJSONL(TRACE_FILE);
      res.json({ status: "ok", traces: data });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  });
}

module.exports = { registerAdminRoutes };