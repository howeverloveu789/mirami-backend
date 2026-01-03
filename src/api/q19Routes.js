// src/api/q19Routes.js
const express = require('express');
const { runQ19 } = require('../core/engine/runQ19');

// 答案對應分數：A=0, B=0.25, C=0.6, D=1.0
const SCALE = { A: 0.0, B: 0.25, C: 0.6, D: 1.0 };

/**
 * @param {import('express').Application} app
 */
function registerQ19Routes(app) {
  const router = express.Router();

  // === 原本的 /q19/submit ===
router.post('/q19/submit', (req, res) => {
  try {
    const answers = req.body && req.body.answers;

    // 基本驗證


    if (!answers || typeof answers !== 'object') {
      return res
        .status(400)
        .json({ error: 'answers is required and must be an object' });
    }

    const qIds = Object.keys(answers);
    const answeredCount = qIds.length;

    // 計算 rawScore
    let rawScore = 0;
    for (const qId of qIds) {
      const choice = String(answers[qId] || '')
        .toUpperCase()
        .trim();
      rawScore += SCALE[choice] ?? 0;
    }

    // 轉成 0–100 總分
    const maxScore = answeredCount * 1.0;
    const totalScore =
      maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;

    // 依總分分級
    let level = 'C';
    if (totalScore <= 25) level = 'A';
    else if (totalScore <= 60) level = 'B';
    else if (totalScore <= 85) level = 'C';
    else level = 'D';

    const result = {
      meta: {
        testId: 'Q19',
        version: '0.2',
        timestamp: new Date().toISOString(),
      },
      scores: {
        answeredCount,
        totalScore,
        level,
      },
      report: {
        summary: `目前整體等級為 ${level}，總分 ${totalScore}（0–100）。這是依 A/B/C/D 映射分數計算出的簡化版結果，已可用於前端展示與銷售。`,
      },
      rawAnswers: answers,
    };

    return res.json(result);
  } catch (err) {
    console.error('Q19 /q19/submit ERROR', {
      time: new Date().toISOString(),
      message: err?.message,
      stack: err?.stack,
      bodySample: JSON.stringify(req.body || {}).slice(0, 500),
    });

    return res.status(500).json({ error: 'internal error' });
  }
});

  // === 新增：測試用 /q19/test，直接跑 runQ19 ===
  app.post('/q19/test', async (req, res) => {
    try {
      // 這裡暫時丟一個錯誤來測 log，有確認之後可以移除

      const answers = req.body && req.body.answers;
      if (!answers || typeof answers !== 'object') {
        return res
          .status(400)
          .json({ error: 'answers is required and must be an object' });
      }

      // 用你自己的引擎算報告
      const result = await runQ19({ answers });

      return res.status(200).json(result);
    } catch (err) {
      console.error('Q19 /q19/test ERROR', {
        time: new Date().toISOString(),
        message: err?.message,
        stack: err?.stack,
      });

      return res.status(500).json({ error: 'Q19 test failed' });
    }
  });

  app.use('/', router);
}

module.exports = { registerQ19Routes };
