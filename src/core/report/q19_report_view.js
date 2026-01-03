// src/core/report/q19_report_view.js
const crypto = require('crypto');
const { buildQ19Report } = require('./q19_report');

/**
 * 將結構化的 Q19 報告，包成「給 P / 前端用」的一層 view
 * 保證：同一組 scores + answers → 結構一致，只在文案模板上 20% 變化
 */
function buildQ19View(scores, answers, options = {}) {
  const core = buildQ19Report(scores, answers);

  // 用 reportId 或 scores 的 hash 當 seed，保證同一輪結果穩定
  const seedSource =
    options.reportId ||
    JSON.stringify({ groups: scores.groups || [], answers });
  const seed = hashToInt(seedSource);

  const primary = core.thinkingRoutes?.primary || null;

  const identityText = renderIdentity(core, seed);
  const trapText = renderTraps(core, seed + 1);
  const earlyWarningsText = renderEarlyWarnings(core, seed + 2);

  return {
    P_MODE: 'Q19_RHYTHM_REPORT',
    LOCKED_20: true,
    primaryRhythm: primary,
    sections: {
      identity: identityText,
      trap: trapText,
      earlyWarnings: earlyWarningsText,
    },
    core, // 選配：保留原始結構，前端要用可以讀這裡
  };
}

function hashToInt(str) {
  const h = crypto.createHash('sha256').update(str).digest('hex');
  return parseInt(h.slice(0, 8), 16); // 0 ~ 2^32
}

// --- identity / trap / earlyWarnings 各自 2–3 組模板 ---

function renderIdentity(core, seed) {
  const primary = core.thinkingRoutes?.primary;
  const snippets = core.identitySnippets || [];
  const titles = snippets.map((s) => s.title).join(', ');

  const templates = [
    () =>
      `這一輪，你的大腦比較常用「${primary?.label || '這組節奏'}」在看局，` +
      `整體節奏偏向：${titles}。`,
    () =>
      `現在這一輪，你啟動得最多的，是「${primary?.label || '這組節奏'}」，` +
      `整體看起來像是：${titles} 這類的組合。`,
    () =>
      `如果要用一句話形容這一輪的大腦節奏，會是「${primary?.label || '這組節奏'}」，` +
      `背後的運作習慣大致落在：${titles}。`,
  ];

  return pickBySeed(templates, seed)();
}

function renderTraps(core, seed) {
  const traps = core.trapMap || [];

  if (!traps.length) {
    return '這一輪沒有看到特別突出的失衡節奏，平常的小卡關大多來自環境和負載，而不是單一習慣。';
  }

  const highOrClear = traps.filter(
    (t) => t.intensity === 'high' || t.intensity === 'clear'
  );
  const picked = (highOrClear.length ? highOrClear : traps).slice(0, 2);

  const templates = [
    () =>
      `在這一輪裡，比較需要留意的節奏陷阱，大多跟「${picked
        .map((t) => t.label)
        .join('、')}」有關。它們不代表錯，而是代表：在壓力一高時，你比較容易從這幾個地方開始漏能量。`,
    () =>
      `如果只挑一兩個地方提醒未來的你，那會是「${picked
        .map((t) => t.label)
        .join('、')}」。當生活變得很忙或很吵時，你的節奏傾向從這裡開始歪掉。`,
  ];

  return pickBySeed(templates, seed)();
}

function renderEarlyWarnings(core, seed) {
  const lines = core.earlyWarnings || [];
  if (!lines.length) {
    return '目前早期訊號偏溫和，比較像是提醒你：當責任和壓力慢慢變多時，原本的小習慣只是被放大，不會突然變成另一個人。';
  }

  const templates = [
    () =>
      `如果未來哪一天你又掉進同樣的節奏，通常會先出現這些小訊號：${lines.join(
        ' '
      )}`,
    () =>
      `早期訊號其實已經在你生活裡，只是過去沒有被叫出名字。像這一輪看到的：${lines.join(
        ' '
      )}`,
  ];

  return pickBySeed(templates, seed)();
}

function pickBySeed(arr, seed) {
  const idx = Math.abs(seed) % arr.length;
  return arr[idx];
}

module.exports = {
  buildQ19View,
};
