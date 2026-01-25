/**
 * MIRAMI v3.7 — Variant Generator
 *
 * 自動生成高品質語言變體，用於：
 * - A_variants.json
 * - B_variants.json
 * - C_variants.json
 *
 * 每次可生成 N 個 variants，並自動過濾：
 * - RED FLAG 污染
 * - 心理化
 * - 建議語氣
 * - 情緒語氣
 * - 非鏡子語氣
 * - 非該引擎語氣（A/B/C）
 */

const fetch = require("node-fetch");

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1";

const RED_FLAG_PREFIXES = [
  "The constraint least able",
  "If this rhythm continues",
  "If this protection is removed",
  "If this pattern holds",
  "What is least necessary to introduce"
];

const ENGINE_TONE = {
  A: ["forward", "momentum", "switching", "compressed", "activation"],
  B: ["suspension", "delayed", "paused", "evaluation", "monitoring"],
  C: ["reduced", "withdrawal", "exposure", "narrowed", "limited"]
};

async function callOpenAI(prompt) {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.7,
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user }
      ]
    })
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim();
}

function isValidVariant(text, engine) {
  if (!text) return false;

  // RED FLAG contamination
  if (RED_FLAG_PREFIXES.some(p => text.includes(p))) return false;

  // Must contain at least one engine tone word
  const tone = ENGINE_TONE[engine];
  if (!tone.some(w => text.includes(w))) return false;

  // No advice
  if (text.includes("should") || text.includes("need to")) return false;

  // No emotions
  if (text.includes("feel") || text.includes("worry")) return false;

  return true;
}

async function generateVariants({ engine, section, count = 20 }) {
  const systemPrompt = `
You are generating MIRAMI v3.7 language variants.

Rules:
- Mirror language only.
- No emotions.
- No advice.
- No interpretation.
- No RED FLAG frames.
- Must match engine tone (${engine}).
- Must be a single sentence.
- Must be structural, behavioral, timing-based.
- Must NOT mention "SECTION".
`;

  const userPrompt = `
Generate ${count} variants for:
ENGINE: ${engine}
SECTION: ${section}

Output format:
- One variant per line.
- No numbering.
- No bullets.
`;

  const raw = await callOpenAI({
    system: systemPrompt,
    user: userPrompt
  });

  const lines = raw
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const filtered = lines.filter(l => isValidVariant(l, engine));

  return filtered;
}

module.exports = { generateVariants };