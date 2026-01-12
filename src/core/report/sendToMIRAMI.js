const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const OpenAI = require("openai");

/**
 * MIRAMI Narrative Engine — Q19
 * - Always load latest prompt from file
 * - No prompt cache
 * - Strong debug fingerprint
 */

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🔒 每次即時讀 prompt（完全不吃 require / fs cache）
function loadSystemPrompt() {
  const promptPath = path.join(
    __dirname,
    "../prompts/q19_p_prompt.txt"
  );

  const raw = fs.readFileSync(promptPath, {
    encoding: "utf8",
    flag: "r"
  });

  return raw;
}

// 🔐 用 prompt 內容產生指紋（一眼知道是不是新版）
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

  // ① Load prompt (no cache)
  const systemPrompt = loadSystemPrompt();
  const promptHash = hashPrompt(systemPrompt);

  // 🔴 HARD DEBUG — 不可能看錯
  console.log("========================================");
  console.log("[MIRAMI] sendToMIRAMI CALLED");
  console.log("[MIRAMI] prompt hash:", promptHash);
  console.log("[MIRAMI] prompt first line:",
    systemPrompt.split("\n")[0]
  );
  console.log("[MIRAMI] varoState keys:",
    Object.keys(varoState || {})
  );
  console.log("========================================");

  // ② Call OpenAI
  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: JSON.stringify(varoState, null, 2)
      }
    ]
  });

  const content = response?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    console.error("[MIRAMI] Empty or invalid response:", response);
    throw new Error("Empty response from MIRAMI");
  }

  // ③ Return — 單一出口，結構鎖死
  return {
    source: "mirami",
    prompt_hash: promptHash,
    model: "gpt-4.1",
    content: content.trim()
  };
}

module.exports = {
  sendToMIRAMI
};
