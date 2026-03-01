// LV5 Engine – New LV5+ (Five-Section Version)

const { computeLv5Signals } = require("./lv5_computeSignals.js");
const { transformSignalsForLv5 } = require("./lv5_transform.js");
const { buildLv5Payload } = require("./lv5_payload.js");

// ★ signals 出口（給前端或 GPT payload 用）
function computeSignals(answers = []) {
  return computeLv5Signals(answers);
}

// ★ LV5+ pipeline：answers → signals → osSummary → payload
function runLv5Engine({ answers = [], userId = "ANON", patternId = 31 } = {}) {
  const generatedAt = new Date().toISOString();

  const rawSignals = computeLv5Signals(answers);
  const transformed = transformSignalsForLv5(rawSignals);
  const payload = buildLv5Payload(transformed, { userId, patternId });

  return {
    ok: true,
    meta: {
      version: "LV5-PLUS",
      userId,
      patternId,
      generatedAt,
      lang: "en"
    },
    core: {
      answers,
      rawSignals,
      osSummary: transformed.osSummary
    },
    payload
  };
}

module.exports = { runLv5Engine, computeSignals };
