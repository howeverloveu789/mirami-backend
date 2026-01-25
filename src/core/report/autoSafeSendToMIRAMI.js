// === 完全對齊你專案的 autoSafeSendToMIRAMI.js 最終版 ===

/**
 * autoSafeSendToMIRAMI (v3.8)
 * - Single-call MIRAMI
 * - Automatic fallback
 * - No language logic here (MIRAMI handles it)
 */

const { sendToMIRAMI } = require("./sendToMIRAMI");

async function autoSafeSendToMIRAMI(input = {}) {
  try {
    const result = await sendToMIRAMI(input);

    return {
      content: result?.content ?? null,
      report_id: result?.report_id ?? ("mirami_" + Date.now()),
      used_fallback: false,
      attempts: 1,
      quality: result?.quality ?? { score: null }
    };

  } catch (err) {
    // fallback
    return {
      content: "Your report is ready.",
      report_id: "fallback_" + Date.now(),
      used_fallback: true,
      attempts: 2,
      quality: { score: null }
    };
  }
}

module.exports = { autoSafeSendToMIRAMI };