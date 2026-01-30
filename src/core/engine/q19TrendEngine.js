/**
 * q19ClusterEngine (optional)
 * - Not used in v4.1
 * - Reserved for v4.2+ (9-axis + trend analysis)
 */

// === 完全對齊你專案的 q19TrendEngine.js 最終版 ===

/**
 * Trend Engine (v3.8)
 * - Reads MEMORY v2
 * - Computes A/B/C trend across runs
 * - Returns direction + volatility + summary
 */

const fs = require("fs");
const path = require("path");

const MEMORY_FILE = path.join(__dirname, "../../../data/q19_memory.jsonl");

function loadMemory(session_id) {
  if (!fs.existsSync(MEMORY_FILE)) return [];

  const lines = fs.readFileSync(MEMORY_FILE, "utf-8")
    .trim()
    .split("\n")
    .filter(Boolean);

  return lines
    .map(l => JSON.parse(l))
    .filter(r => r.session_id === session_id)
    .sort((a, b) => a.run_index - b.run_index);
}

function computeTrend(records) {
  if (records.length < 2) {
    return {
      trend: "insufficient_data",
      volatility: 0,
      summary: "Not enough data to compute trend."
    };
  }

  const first = records[0].distribution;
  const last = records[records.length - 1].distribution;

  const deltaA = last.A - first.A;
  const deltaB = last.B - first.B;
  const deltaC = last.C - first.C;

  let trend = "stable";
  if (deltaC > 0.1) trend = "toward_C";
  else if (deltaA > 0.1) trend = "toward_A";
  else if (deltaB > 0.1) trend = "toward_B";

  const volatility =
    Math.abs(deltaA) + Math.abs(deltaB) + Math.abs(deltaC);

  return {
    trend,
    volatility,
    summary: `A:${deltaA.toFixed(3)}, B:${deltaB.toFixed(3)}, C:${deltaC.toFixed(3)}`
  };
}

function analyzeTrend(session_id) {
  const records = loadMemory(session_id);
  return computeTrend(records);
}

module.exports = { analyzeTrend };