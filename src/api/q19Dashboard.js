// === 完全對齊你專案的 q19Dashboard.js 最終版 ===

const fs = require("fs");
const path = require("path");

const MEMORY_FILE = path.join(__dirname, "../../data/q19_memory.jsonl");

function loadAllMemory() {
  if (!fs.existsSync(MEMORY_FILE)) return [];
  return fs.readFileSync(MEMORY_FILE, "utf-8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map(l => JSON.parse(l));
}

function buildDashboard() {
  const records = loadAllMemory();

  const sessions = {};

  for (const r of records) {
    if (!sessions[r.session_id]) sessions[r.session_id] = [];
    sessions[r.session_id].push(r);
  }

  const dashboard = [];

  for (const [session_id, runs] of Object.entries(sessions)) {
    runs.sort((a, b) => a.run_index - b.run_index);

    const first = runs[0];
    const last = runs[runs.length - 1];

    dashboard.push({
      session_id,
      runs: runs.length,
      first_state: first.state,
      last_state: last.state,
      first_distribution: first.distribution,
      last_distribution: last.distribution,
      trend: {
        A: last.distribution.A - first.distribution.A,
        B: last.distribution.B - first.distribution.B,
        C: last.distribution.C - first.distribution.C
      }
    });
  }

  return dashboard;
}

function registerDashboardRoutes(app) {
  app.get("/api/q19/dashboard", (req, res) => {
    try {
      const data = buildDashboard();
      res.json({ status: "ok", dashboard: data });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  });
}

module.exports = { registerDashboardRoutes };