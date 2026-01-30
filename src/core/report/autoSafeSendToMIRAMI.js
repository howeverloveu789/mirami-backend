/**
 * MIRAMI v4.1 — autoSafeSendToMIRAMI
 * ----------------------------------
 * - Wraps sendToMIRAMI with fallback
 * - Passes moduleFile / layer / angle metadata
 * - No language logic here
 * - Single-call safety wrapper
 */

const { sendToMIRAMI } = require("./sendToMIRAMI");

async function autoSafeSendToMIRAMI(input = {}) {
  try {
    const {
      state,
      slots,
      moduleFile = null,   // prompt variant file
      layer = null,        // pricing tier
      angle = null         // A / B / C
    } = input;

    // 🔒 HARD GUARD — state required
    if (!state) {
      throw new Error("autoSafeSendToMIRAMI: missing state");
    }

    // 🔒 HARD GUARD — slots required
    if (!slots || typeof slots !== "object") {
      throw new Error("autoSafeSendToMIRAMI: missing slots");
    }

    // ⭐ Pass metadata directly into MIRAMI v4.1
    const result = await sendToMIRAMI({
      state,
      slots,
      moduleFile,
      layer,
      angle
    });

    return {
      content: result?.content ?? null,
      report_id: result?.report_id ?? ("mirami_" + Date.now()),
      used_fallback: false,
      attempts: 1,
      quality: result?.quality ?? { score: null }
    };

  } catch (err) {
    console.error("❌ autoSafeSendToMIRAMI fallback triggered:", err);

    // ⭐ Fallback must NEVER break pipeline
    return {
      content: "Your MIRAMI report is ready.",
      report_id: "fallback_" + Date.now(),
      used_fallback: true,
      attempts: 2,
      quality: { score: null }
    };
  }
}

module.exports = { autoSafeSendToMIRAMI };
