const express = require("express");

const { runQ19 } = require("../core/engine/runQ19");
const { analyzeQ19ToJSON } = require("../core/analysis/analyzeQ19ToJSON");
const { buildQ19Payload } = require("../core/report/buildQ19Payload");
const { sendToMIRAMI } = require("../core/report/sendToMIRAMI");

const {
  saveQ19Analysis,
  getQ19ReportById
} = require("../core/memory/q19MemoryStore");

function registerQ19Routes(app) {
  const router = express.Router();

  /**
   * POST /api/q19/submit
   */
  router.post("/submit", async (req, res) => {
    try {
      console.log("========================================");
      console.log("[Q19 SUBMIT] HIT /api/q19/submit");
      console.log("[Q19 SUBMIT] time:", new Date().toISOString());
      console.log("[Q19 SUBMIT] body keys:", Object.keys(req.body || {}));
      console.log("========================================");

      const { answers, session_id, started_at } = req.body || {};

      if (!answers || typeof answers !== "object") {
        return res.status(400).json({
          error: "answers must be an object",
          __debug: "Q19_SUBMIT_VALIDATION_FAIL"
        });
      }

      // ① 核心引擎（⭐ report_id 唯一來源）
      const coreResult = await runQ19({
        answers,
        session_id: session_id || null,
        started_at: started_at || null
      });

      const { report_id, reliability } = coreResult;

      // ② 純分析
      const analysisJSON = analyzeQ19ToJSON(answers);

      // ③ 存 analysis（用同一個 report_id）
      saveQ19Analysis({
        report_id,
        session_id: session_id || null,
        reliability_level: reliability.level,
        analysis: analysisJSON
      });

      // ④ 組 MIRAMI payload（直接用 report_id）
      const payload = buildQ19Payload(
        { report_id, session_id },
        analysisJSON,
        reliability
      );

      console.log("[Q19 SUBMIT] calling sendToMIRAMI");

      // ⑤ 呼叫 MIRAMI
      const miramiResult = await sendToMIRAMI(payload);

      console.log(
        "[Q19 SUBMIT] MIRAMI returned content length:",
        miramiResult?.content?.length
      );

      // ⑥ 存 final_report（⭐ 關鍵）
      saveQ19Analysis({
        report_id,
        final_report: miramiResult.content
      });

      // ⑦ 回傳前端（⭐ 絕不再是 null）
      return res.json({
        status: "ok",
        report_id,
        final_report: miramiResult.content,
        __debug: {
          route: "POST /api/q19/submit",
          version: "Q19_SUBMIT_V2026_01_11_FINAL"
        }
      });

    } catch (err) {
      console.error("[Q19 SUBMIT ERROR]", err);
      return res.status(500).json({
        error: "internal error",
        message: err.message,
        __debug: "Q19_SUBMIT_EXCEPTION"
      });
    }
  });

  /**
   * ✅ STEP 2：GET /api/q19/report?rid=xxx
   */
  router.get("/report", async (req, res) => {
    try {
      const { rid } = req.query;

      if (!rid) {
        return res.status(400).json({
          error: "missing report_id"
        });
      }

      const record = getQ19ReportById(rid);

      if (!record || !record.final_report) {
        return res.status(404).json({
          error: "report not found"
        });
      }

      return res.json({
        final_report: record.final_report
      });

    } catch (err) {
      console.error("[Q19 REPORT ERROR]", err);
      return res.status(500).json({
        error: "internal error"
      });
    }
  });

  app.use("/api/q19", router);
}

module.exports = {
  registerQ19Routes
};
