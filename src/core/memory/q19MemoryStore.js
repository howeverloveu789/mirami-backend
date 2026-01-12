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

/**
 * 🔹 工具：讀取全部 records（只給 Step 2 用，效能先不管）
 */
function readAllRecords() {
  if (!fs.existsSync(FILE)) return [];
  const lines = fs.readFileSync(FILE, "utf-8").trim().split("\n");
  return lines.map(line => {
    try {
      return JSON.parse(line);
    } catch {
      return null;
    }
  }).filter(Boolean);
}

/**
 * 🆕 核心：存 Q19 分析 or 報告（同一個入口）
 *
 * 用法：
 * - submit 前半段：存 analysis
 * - MIRAMI 回來後：存 final_report + report_id
 */
function saveQ19Analysis(input = {}) {
  ensureDir();

  const record = {
    id: "q19_" + crypto.randomUUID(),
    test_id: "Q19",
    report_id: input.report_id || null,
    session_id: input.session_id || null,
    created_at: new Date().toISOString(),

    reliability_level: input.reliability_level || null,
    analysis: input.analysis || null,

    // ⭐ Step 2 關鍵欄位
    final_report: input.final_report || null
  };

  fs.appendFileSync(FILE, JSON.stringify(record) + "\n", "utf-8");

  return record; // 👈 讓 submit 可以拿到 report_id
}

/**
 * ✅ Step 2 專用：用 report_id 取報告
 */
function getQ19ReportById(report_id) {
  if (!report_id) return null;

  const records = readAllRecords();

  // 從後面找（最新優先）
  for (let i = records.length - 1; i >= 0; i--) {
    const r = records[i];
    if (r.report_id === report_id && r.final_report) {
      return r;
    }
  }

  return null;
}

/**
 * （保留）如果你其他地方還在用
 */
function getLatestQ19Memory(session_id) {
  if (!session_id) return null;

  const records = readAllRecords();

  for (let i = records.length - 1; i >= 0; i--) {
    const r = records[i];
    if (r.session_id === session_id) {
      return r;
    }
  }

  return null;
}

module.exports = {
  saveQ19Analysis,
  getQ19ReportById,
  getLatestQ19Memory
};
