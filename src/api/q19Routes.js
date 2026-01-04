// src/api/q19Routes.js

const express = require('express');

/**
* Q19 Route – additive version
*
* 原本功能：
* - 接收 Q19 answers
*
* 新增功能（不影響舊流程）：
* - 記錄使用者對「結果」的自我回應（success / fail / partial / not_done）
* - 記錄使用者如何描述這次結果（memory text）
*
* ⚠️ 不評分、不紅綠燈、不解釋
*/

/**
* @param {import('express').Application} app
*/
function registerQ19Routes(app) {
const router = express.Router();

/**
* POST /q19/submit
*
* 舊前端 body（仍然支援）：
* {
* answers: { q1: "A", q2: "C", ... }
* }
*
* 新增可選欄位（有就收，沒有就略過）：
* {
* result: "success" | "fail" | "partial" | "not_done",
* message: "使用者對這次結果的描述"
* }
*/
router.post('/q19/submit', (req, res) => {
try {
const { answers, result, message } = req.body || {};

// 1️⃣ 原本的必要驗證（不動）
if (!answers || typeof answers !== 'object') {
return res.status(400).json({
error: 'answers is required and must be an object',
});
}

const answeredCount = Object.keys(answers).length;

// 2️⃣ 新增：結果分類（可選，不影響原流程）
const allowedResults = ['success', 'fail', 'partial', 'not_done'];
const normalizedResult = allowedResults.includes(result)
? result
: null;

// 3️⃣ 新增：語言記憶（可選）
const messageText =
typeof message === 'string' ? message.trim() : null;

// 4️⃣ 回傳結構（原本成功回應 + memory 確認）
return res.status(200).json({
meta: {
testId: 'Q19',
mode: 'additive',
timestamp: new Date().toISOString(),
},
payload: {
answeredCount,
answers, // 原本就有的資料
},
memory: normalizedResult || messageText
? {
result: normalizedResult,
messageSample:
messageText && messageText.length > 120
? messageText.slice(0, 120) + '…'
: messageText,
}
: null,
note:
'Submission received. Memory fields are optional and stored as-is.',
});
} catch (err) {
console.error('Q19 /q19/submit ERROR', {
time: new Date().toISOString(),
message: err?.message,
});

return res.status(500).json({
error: 'internal error',
});
}
});

app.use('/', router);
}

module.exports = { registerQ19Routes }; 