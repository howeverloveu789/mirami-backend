console.log("🔥 Q19 ROUTE FILE LOADED:", __filename);
const express = require("express");

const { runQ19 } = require("../core/engine/runQ19");
const { analyzeQ19ToJSON } = require("../core/analysis/analyzeQ19ToJSON");
const { resolveFinalReport } = require("../core/report/resolveFinalReport");

const {
  saveQ19Analysis,
  getQ19ReportById
} = require("../core/memory/q19MemoryStore");

/**
 * Q19 API Routes
 * --------------------------------
 * Backend responsibilities ONLY:
 * - Generate report_id
 * - Store analysis & final_report
 * - Serve report by report_id
 *
 * ❌ No redirect logic
 * ❌ No frontend assumptions
 */
function registerQ19Routes(app) {
  const router = express.Router();

  /**
   * ======================================
   * POST /api/q19/submit
   * ======================================
   */
  router.post("/submit", async (req, res) => {
    try {
      console.log("========================================");
      console.log("[Q19 SUBMIT] HIT /api/q19/submit");
      console.log("[Q19 SUBMIT] time:", new Date().toISOString());
      console.log("[Q19 SUBMIT] body keys:", Object.keys(req.body || {}));
      console.log("========================================");

      const { answers, session_id, started_at } = req.body || {};

      // 基本防呆
      if (!answers || typeof answers !== "object") {
        return res.status(400).json({
          error: "answers must be an object",
          __debug: "Q19_SUBMIT_VALIDATION_FAIL"
        });
      }

      // ① 核心引擎（唯一產生 report_id）
      const coreResult = await runQ19({
        answers,
        session_id: session_id || null,
        started_at: started_at || null
      });

      const { report_id, reliability } = coreResult;

      // ② 純分析（無語言）
      const analysisJSON = analyzeQ19ToJSON(answers);

      // ③ 儲存 analysis
      saveQ19Analysis({
        report_id,
        session_id: session_id || null,
        reliability_level: reliability.level,
        analysis: analysisJSON
      });

      // ⑤ 由 report layer 決定最終輸出
      const resolved = await resolveFinalReport({
        answers,
        payload
      });

      /**
       * Normalize final result
       * - transitional: { mode, final_report }
       * - mirami: { content }
       */
      const final_report =
        resolved.final_report ||
        resolved.content ||
        null;

      const mode =
        resolved.mode || "mirami";

      if (!final_report) {
        throw new Error("FINAL_REPORT_EMPTY");
      }

      console.log(
        "[Q19 SUBMIT] final_report length:",
        final_report.length,
        "mode:",
        mode
      );

      // ⑥ 儲存 final_report
      saveQ19Analysis({
        report_id,
        final_report
      });

      // ⑦ 回傳給前端
      return res.json({
        status: "ok",
        report_id,
        final_report,
        __debug: {
          route: "POST /api/q19/submit",
          version: "Q19_SUBMIT_V2026_01_11_FINAL",
          mode
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
   * ======================================
   * GET /api/q19/report?rid=xxx
   * ======================================
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
