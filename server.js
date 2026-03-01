import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// LV6
import { computeEngine } from "./LV6/ENGINE/compute_engine.js";

// LV7（EL6）
import { generateEL6Report } from "./LV7/report_generator.js";
import { gpt } from "./utils/gpt.js";

// -----------------------------
// Debug helpers
// -----------------------------
function ensureDebugDir() {
  const dir = path.join(__dirname, "debug");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function saveDump(name, data) {
  const dir = ensureDebugDir();
  const safe = data ?? { error: "EMPTY_DATA" }; // 防止 undefined
  const file = path.join(
    dir,
    `${name}_${new Date().toISOString().replace(/[:.]/g, "-")}.json`
  );
  fs.writeFileSync(file, JSON.stringify(safe, null, 2));
  return file;
}

// -----------------------------
// /api/report → EL6 報告
// -----------------------------
app.post("/api/report", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ ok: false, error: "EMPTY_ANSWERS" });
    }

    saveDump("answers", answers);

    const out = await generateEL6Report(answers, gpt);

    saveDump("semantic", {
      primary_core: out.primary_core ?? null,
      supporting_signals: out.supporting_signals ?? null,
      collapse_model: out.collapse_model ?? null
    });

    saveDump("report", { text: out.report ?? "" });

    res.json(out);
  } catch (err) {
    console.error("LV7 REPORT ERROR:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// -----------------------------
// /api/schema → LV6 ENGINE
// -----------------------------
app.post("/api/schema", (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ ok: false, error: "EMPTY_ANSWERS" });
    }

    saveDump("answers", answers);

    const engine = computeEngine(answers);

    saveDump("engine", engine ?? { error: "EMPTY_ENGINE" });

    res.json({
      ok: true,
      engine
    });
  } catch (err) {
    console.error("ENGINE ERROR:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// -----------------------------
app.listen(10000, () => {
  console.log(`MIRAMI LV7 backend running on http://localhost:10000`);
});
