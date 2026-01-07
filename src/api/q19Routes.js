// src/api/q19Routes.js
const express = require("express");
const { runQ19 } = require("../core/engine/runQ19");

function registerQ19Routes(app) {
  const router = express.Router();

  /**
   * POST /api/q19/submit
   */
  router.post("/submit", async (req, res) => {
    try {
      const { answers, session_id, started_at } = req.body || {};

      // ① 基礎驗證
      if (!answers || typeof answers !== "object") {
        return res.status(400).json({
          error: "answers must be an object"
        });
      }

      // ② 呼叫核心引擎（唯一入口）
      const result = await runQ19({
        answers,
        session_id: session_id || null,
        started_at: started_at || null
      });

      // ③ 穩定回傳（memory 成功與否不影響）
      return res.json({
        status: "ok",
        meta: result.meta,
        report: result.report,
        reliability: result.reliability
      });

    } catch (err) {
      console.error("[Q19 ROUTE ERROR]", err);
      return res.status(500).json({
        error: "internal error"
      });
    }
  });

  // 模組只在這裡決定 prefix
  app.use("/api/q19", router);
}

module.exports = {
  registerQ19Routes
};
