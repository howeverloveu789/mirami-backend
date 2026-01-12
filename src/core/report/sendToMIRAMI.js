const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const OpenAI = require("openai");

/**
 * MIRAMI Narrative Engine — Q19
 * - Always load latest prompt from file
 * - Linux-safe (case-sensitive)
 * - Absolute path anchored at /src
 */

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * 🔒 Load system prompt (NO cache)
 * Path is anchored from project root /src
 */
function loadSystemPrompt() {
  const promptPath = path.resolve(
    process.cwd(),          // /opt/render/project/src
    "src",
    "core",
    "prompts",
    "q19_P_prompt.txt"      // ⚠️ 大寫 P，跟 repo 一致
  );

  if (!fs.existsSync(promptPath)) {
    throw new Error(
      `[MIRAMI] Prompt file not found at ${promptPath}`
    );
  }

  return fs.readFileSync(promptPath, "utf8");
}

/**
 * 🔐 Fingerprint prompt version
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

  const systemPrompt = loadSystemPrompt();
  const promptHash = hashPrompt(systemPrompt);

  console.log("========================================");
  console.log("[MIRAMI] sendToMIRAMI CALLED");
  console.log("[MIRAMI] prompt hash:", promptHash);
  console.log("[MIRAMI] prompt path OK");
  console.log("[MIRAMI] varoState keys:", Object.keys(varoState));
  console.log("========================================");

  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify(varoState, null, 2) }
    ]
  });

  const content = response?.choices?.[0]?.message?.content;

  if (!content) {
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
