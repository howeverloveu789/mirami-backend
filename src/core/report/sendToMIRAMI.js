/**
 * MIRAMI v4.1 — Single-call MIRAMI generator
 * - Uses OpenAI Chat Completions (gpt-4.1)
 * - Returns: { report_id, content, quality }
 */

const fetch = require("node-fetch");
const Engine = require("../engine");

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4.1"; // 🔒 固定使用 gpt-4.1，不依賴環境變數

function buildSystemPrompt() {
  return `
You are the MIRAMI Q19 report engine.

Your task is to generate a complete five‑section behavioral report and five corresponding red flags in a single response. You must follow the required structure exactly and maintain a strictly observational, unsentimental tone.

Your output must contain:
- SECTION_1 through SECTION_5
- RED_FLAG_1 through RED_FLAG_5

Rules:
1. Mirror language only. Describe what is happening, not why.
2. No advice, no suggestions, no coping strategies, no instructions.
3. No emotions, no reassurance, no praise, no empathy.
4. No psychological interpretation, no personality labels, no speculation.
5. No references to “MIRAMI”, “Q19”, “axes”, “models”, or internal mechanics.
6. Each SECTION_x must be 4–7 sentences.
7. Each RED_FLAG_x must be exactly one sentence.
8. Each RED_FLAG_x must be derived only from its corresponding SECTION_x.
9. RED_FLAG_x must not repeat or overlap with any other RED_FLAG.
10. Maintain a cool, structured, observational tone throughout.
11. Do not speak to the user directly.
12. Do not include placeholders, variables, or template syntax in the output.

Required output format:

SECTION_1:
<paragraph>

RED_FLAG_1:
<single sentence>

SECTION_2:
<paragraph>

RED_FLAG_2:
<single sentence>

SECTION_3:
<paragraph>

RED_FLAG_3:
<single sentence>

SECTION_4:
<paragraph>

RED_FLAG_4:
<single sentence>

SECTION_5:
<paragraph>

RED_FLAG_5:
<single sentence>
`;
}

function buildUserPrompt({ state, slots }) {
  const { mainDomain, mainLoad, redFlagLoad, userQuote, engine } = slots || {};

  return `
User state (internal context only):
${JSON.stringify(state || {}, null, 2)}

Slots:
- Main domain: ${mainDomain || "unspecified"}
- Main load: ${mainLoad || "unspecified"}
- Red‑flag load: ${redFlagLoad || "unspecified"}
- User quote: ${userQuote || "unspecified"}
- Engine: ${engine || "A/B/C (unspecified)"}

Write a full MIRAMI report that:
- Uses the fixed five‑module structure (behavior, time, protection, adjustment, long‑term inertia).
- Each SECTION_x is 4–7 sentences.
- Each RED_FLAG_x is exactly one sentence.
- Each RED_FLAG_x must be derived strictly from its corresponding SECTION_x.
- Maintain a neutral, observational, unsentimental tone.
- Do not speak to the user directly.
- Do not repeat the user quote in an emotional or interpretive way.
- Do not give advice, reassurance, or coping strategies.
`;
}

async function callOpenAI(systemPrompt, userPrompt) {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.55,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("MIRAMI: empty response from model");
  }

  return content;
}

async function sendToMIRAMI({ state, slots }) {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt({ state, slots });

  const finalReport = await callOpenAI(systemPrompt, userPrompt);

  return {
    report_id: "mirami_" + Date.now(),
    content: finalReport,
    quality: { score: null }
  };
}

module.exports = { sendToMIRAMI };
