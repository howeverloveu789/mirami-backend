const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const OpenAI = require("openai");

/**
 * MIRAMI Narrative Engine — Q19
 * GPT = amplifier, NOT replacement
 * - P prompt = core brain
 * - Guard prompt = structure & tone lock
 * - Linux-safe, absolute path
 */

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * 🔒 Load base P prompt (core capability)
 */
function loadPPrompt() {
  const promptPath = path.resolve(
    process.cwd(),          // /opt/render/project/src
    "src",
    "core",
    "prompts",
    "q19_P_prompt.txt"      // ⚠️ 保留原本大寫 P
  );

  if (!fs.existsSync(promptPath)) {
    throw new Error(
      `[MIRAMI] P prompt not found at ${promptPath}`
    );
  }

  return fs.readFileSync(promptPath, "utf8");
}

/**
 * 🧱 MIRAMI Report Guard (DO NOT externalize)
 * This layer locks tone & structure.
 */
function loadReportGuard() {
  return `
You are generating a MIRAMI Q19 mirror report.

This is NOT advice, NOT coaching, NOT diagnosis.

ABSOLUTE RULES:
- Do NOT give advice or suggestions.
- Do NOT predict future outcomes.
- Do NOT label personality or identity.
- Do NOT explain internal systems, logic, or scores.
- Do NOT mention questions, axes, rhythms, or models.

TONE:
- Calm
- Precise
- Observational
- Non-motivational
- No teaching language

STRUCTURE (MUST FOLLOW EXACTLY):

1. Your Present Pattern
Describe current operating mode only.
Focus on motion, pacing, and closure.

2. Key Operating Signals
List observable behavioral signals.
End with ONE sentence starting with:
"Net effect:"

3. Trade-Off Load
Describe where effort or weight is concentrated.
Frame as exchange, not problem.

4. Flow Pattern
Describe how actions build, move, and settle.
Do NOT name steps or internal rhythm models.

5. Load State
Summarize overall structural pressure.
No warning, no future framing.

6. Closing Mirror Line
ONE sentence the user can recognize and hold.
No conclusion. No advice.
`;
}

/**
 * 🔐 Fingerprint combined prompt
 */
function hashPrompt(text) {
  return crypto
    .createHash("sha256")
    .update(text)
    .digest("hex")
    .slice(0, 12);
}

async function sendToMIRAMI(varoState) {
  if (!varoState) {
    throw new Error("MIRAMI state payload missing");
  }

  // ① Load prompts
  const pPrompt = loadPPrompt();
  const guardPrompt = loadReportGuard();

  const systemPrompt = `${pPrompt}\n\n${guardPrompt}`;
  const promptHash = hashPrompt(systemPrompt);

  // 🔴 HARD DEBUG
  console.log("========================================");
  console.log("[MIRAMI] sendToMIRAMI CALLED");
  console.log("[MIRAMI] prompt hash:", promptHash);
  console.log("[MIRAMI] P prompt + Guard loaded");
  console.log("[MIRAMI] varoState keys:", Object.keys(varoState));
  console.log("========================================");

  // ② Call OpenAI
  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    temperature: 0.35, // 稍微收斂，避免發散
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify(varoState, null, 2) }
    ]
  });

  const content = response?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("Empty response from MIRAMI");
  }

  return {
    source: "mirami",
    model: "gpt-4.1",
    prompt_hash: promptHash,
    content: content.trim()
  };
}

module.exports = { sendToMIRAMI };
