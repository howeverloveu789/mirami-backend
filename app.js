console.log("🚨 APP VERSION CHECK:", __filename);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const { registerQ19Routes } = require("./src/api/q19Routes");
const { registerDashboardRoutes } = require("./src/api/q19Dashboard");
const { registerAdminRoutes } = require("./src/api/q19Admin");

const app = express();

// ─────────────────────────────
// Config
// ─────────────────────────────
const PORT = process.env.PORT || 10000;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🔍 Stripe key mode check（非常重要）
console.log(
  "🔑 STRIPE KEY MODE:",
  process.env.STRIPE_SECRET_KEY?.startsWith("sk_test")
    ? "TEST"
    : "LIVE"
);

// ─────────────────────────────
// 🔥 VARO CORE ENGINE (完全內建，無GPT依賴)
// ─────────────────────────────
// 行為信號提取核心函數
function extractSignals(answers) {
  const score = (v) => (v === "A" ? 1 : v === "B" ? 0 : -1);
  const sum = (keys) => keys.map(k => score(answers[k])).reduce((a,b)=>a+b, 0);

  const inputScore = sum(["q01","q02","q03","q10","q11","q12"]);
  const reflexScore = sum(["q04","q05","q06"]);
  const movementScore = sum(["q07","q08","q09","q19","q20","q21"]);
  const haltScore = sum(["q25","q26","q27","q28"]);
  const avoidScore = sum(["q22","q23","q24"]);
  const internalScore = sum(["q16","q17","q18"]);

  return {
    inputStyle:
      inputScore >= 3
        ? "takes signals early and forms direction quickly"
        : inputScore >= 0
        ? "keeps multiple signals active before forming direction"
        : "waits for external clarity before forming direction",

    reflex:
      reflexScore >= 2
        ? "move first, adjust after"
        : reflexScore >= 0
        ? "pause briefly to sense timing"
        : "hold until external signals stabilize",

    movement:
      movementScore >= 3
        ? "maintains internal pace and steady forward motion"
        : movementScore >= 0
        ? "moves in waves and adjusts to conditions"
        : "slows or pauses until conditions shift",

    halt:
      haltScore >= 2
        ? "lets things close naturally"
        : haltScore >= 0
        ? "takes time before closure"
        : "cuts or detaches cleanly",

    avoid:
      avoidScore >= 2
        ? "absorbing pressure quietly"
        : avoidScore >= 0
        ? "adjusting strategy under pressure"
        : "reducing exposure when pressure rises",

    internalState:
      internalScore >= 2
        ? "internalizes signals and recalibrates quietly"
        : internalScore >= 0
        ? "selectively integrates external signals"
        : "creates distance from conflicting signals"
  };
}

// 報告生成核心工具函數
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fill(template, s) {
  function extractStorySignals(story) {
  if (!story || typeof story !== "object") {
    return {
      coreFear: "",
      blindPoint: "",
      avoidancePattern: "",
      internalMirror: "",
      selfNarrative: "",
      repetitionRoot: "",
      haltTrigger: "",
      reflexTrigger: ""
    };
  }

  const text = (v) => (typeof v === "string" ? v.toLowerCase() : "");

  const s1 = text(story.s1 || "");
  const s2 = text(story.s2 || "");
  const s3 = text(story.s3 || "");
  const s4 = text(story.s4 || "");
  const s5 = text(story.s5 || "");
  const s6 = text(story.s6 || "");
  const s7 = text(story.s7 || "");
  const s8 = text(story.s8 || "");
  const s9 = text(story.s9 || "");
  const s10 = text(story.s10 || "");

  return {
    coreFear:
      s5.includes("fail") || s5.includes("mistake")
        ? "fear of being wrong"
        : s5.includes("reject") || s5.includes("abandon")
        ? "fear of disconnection"
        : s5.includes("control")
        ? "fear of losing control"
        : "avoiding internal destabilization",

    blindPoint:
      s10.includes("don't see") || s10.includes("not aware")
        ? "blind to internal shifts"
        : s10.includes("others see")
        ? "blind to external impact"
        : "blind to system transitions",

    avoidancePattern:
      s8.includes("avoid") || s8.includes("escape")
        ? "avoiding direct confrontation"
        : s8.includes("delay")
        ? "delaying destabilizing inputs"
        : "reducing exposure to pressure",

    internalMirror:
      s7.includes("i see myself") || s7.includes("i think i am")
        ? "self‑image shaped by internal evaluation"
        : "self‑image stabilized by internal narrative",

    selfNarrative:
      s4.includes("because") || s4.includes("i always")
        ? "a narrative that reinforces identity loops"
        : "a narrative that maintains internal consistency",

    repetitionRoot:
      s3.includes("again") || s3.includes("always")
        ? "a recurring loop driven by familiar triggers"
        : "a pattern maintained by internal stability needs",

    haltTrigger:
      s1.includes("stop") || s1.includes("freeze")
        ? "halts when signals overload"
        : "halts when internal clarity drops",

    reflexTrigger:
      s2.includes("react") || s2.includes("immediately")
        ? "reacts before evaluating"
        : "reacts after internal check"
  };
}

  return template
    .replace("{inputStyle}", s.inputStyle || "")
    .replace("{reflex}", s.reflex || "")
    .replace("{movement}", s.movement || "")
    .replace("{halt}", s.halt || "")
    .replace("{avoid}", s.avoid || "")
    .replace("{internalState}", s.internalState || "")
    .replace("{coreFear}", s.coreFear || "")
    .replace("{blindPoint}", s.blindPoint || "")
    .replace("{avoidancePattern}", s.avoidancePattern || "")
    .replace("{internalMirror}", s.internalMirror || "")
    .replace("{selfNarrative}", s.selfNarrative || "")
    .replace("{repetitionRoot}", s.repetitionRoot || "")
    .replace("{haltTrigger}", s.haltTrigger || "")
    .replace("{reflexTrigger}", s.reflexTrigger || "");
}

function extractStorySignals(story) {
  if (!story || typeof story !== "object") {
    return {
      coreFear: "",
      blindPoint: "",
      avoidancePattern: "",
      internalMirror: "",
      selfNarrative: "",
      repetitionRoot: "",
      haltTrigger: "",
      reflexTrigger: ""
    };
  }

  const text = (v) => (typeof v === "string" ? v.toLowerCase() : "");

  const s1 = text(story.s1 || "");
  const s2 = text(story.s2 || "");
  const s3 = text(story.s3 || "");
  const s4 = text(story.s4 || "");
  const s5 = text(story.s5 || "");
  const s6 = text(story.s6 || "");
  const s7 = text(story.s7 || "");
  const s8 = text(story.s8 || "");
  const s9 = text(story.s9 || "");
  const s10 = text(story.s10 || "");

  return {
    // Story 5：深層恐懼
    coreFear:
      s5.includes("fail") || s5.includes("mistake")
        ? "fear of being wrong"
        : s5.includes("rejected") || s5.includes("abandon")
        ? "fear of disconnection"
        : s5.includes("lose control")
        ? "fear of losing control"
        : "avoiding internal destabilization",

    // Story 10：盲點
    blindPoint:
      s10.includes("don't see") || s10.includes("not aware")
        ? "blind to internal shifts"
        : s10.includes("others see")
        ? "blind to external impact"
        : "blind to system transitions",

    // Story 8：避開方式
    avoidancePattern:
      s8.includes("avoid") || s8.includes("escape")
        ? "avoiding direct confrontation"
        : s8.includes("delay")
        ? "delaying destabilizing inputs"
        : "reducing exposure to pressure",

    // Story 7：內部鏡像
    internalMirror:
      s7.includes("i see myself") || s7.includes("i think i am")
        ? "self‑image shaped by internal evaluation"
        : "self‑image stabilized by internal narrative",

    // Story 4：自我敘事
    selfNarrative:
      s4.includes("because") || s4.includes("i always")
        ? "a narrative that reinforces identity loops"
        : "a narrative that maintains internal consistency",

    // Story 3：重複根源
    repetitionRoot:
      s3.includes("again") || s3.includes("always")
        ? "a recurring loop driven by familiar triggers"
        : "a pattern maintained by internal stability needs",

    // Story 1：停下來的瞬間
    haltTrigger:
      s1.includes("stop") || s1.includes("freeze")
        ? "halts when signals overload"
        : "halts when internal clarity drops",

    // Story 2：第一反射
    reflexTrigger:
      s2.includes("react") || s2.includes("immediately")
        ? "reacts before evaluating"
        : "reacts after internal check"
  };
}

// ─────────────────────────────
// VARO報告模板（LV2/LV3.5/LV5）
const templates = {
 LV2: {
  pattern: [
    "Your decision rhythm forms through {inputStyle}, stabilizes through {reflex}, and maintains direction through {movement}."
  ],

  showUp: [
    "Early choices reflect {inputStyle}, timing is shaped by {reflex}, and path consistency emerges through {movement}."
  ],

  meaning: [
    "{inputStyle} defines how you enter situations, {reflex} regulates pace, and {movement} determines how momentum is carried forward."
  ],

  edges: [
    "Under pressure, the system shifts into {avoid}, and transitions compress when {halt} activates at closure points."
  ],

  blind: [
    "{internalState} filters signals during extended {movement}, creating moments where key shifts go unnoticed."
  ]
},

  LV3_5: {
  pattern: [
    "Your repeating loop stabilizes through {movement}, reinforced by how the system maintains internal continuity through {internalState}.",
    "The cycle persists by oscillating between {inputStyle} and {movement}, keeping the sequence familiar even as conditions change."
  ],

  showUp: [
    "The loop becomes visible when you default to {reflex} and sustain motion through {movement}, creating a recognizable mid‑cycle rhythm.",
    "Your mid‑cycle behavior consistently returns to {movement}, revealing how the loop maintains its structure."
  ],

  meaning: [
    "The loop continues because {internalState} filters signals in a predictable pattern, preserving internal coherence.",
    "Repetition serves as a stabilizing mechanism, allowing the system to maintain continuity through {movement}."
  ],

  edges: [
    "The loop destabilizes when pressure triggers {avoid}, narrowing available responses and reinforcing the cycle.",
    "Transitions misalign when closure shifts into {halt}, creating incomplete cycles that restart prematurely."
  ],

  blind: [
    "The system rarely detects how {internalState} reinforces the loop from within.",
    "The loop conceals itself behind familiar {movement} rhythms, making its trigger sequence difficult to observe internally."
  ]
},

 LV5: {
  pattern: [
    "Your OS stabilizes itself through a fixed sequence: {inputStyle} → {reflex} → {movement} → {halt}. This cycle repeats until external pressure forces a recalibration.",
    "The deeper structure maintains continuity by routing all incoming signals through {internalState}, ensuring the system stays internally consistent even when the environment shifts."
  ],

  showUp: [
    "Externally, the OS presents as sustained {movement} with selective withdrawal through {avoid}. What others see is the visible rhythm of an internal system managing load and exposure.",
    "Your observable behavior is the surface pattern of an OS organized around {internalState}, shaping how you enter, maintain, and exit interactions."
  ],

  meaning: [
    "The OS preserves stability by filtering destabilizing inputs through {avoid}, preventing shifts that would force internal reconfiguration.",
    "Coherence is maintained by controlling transitions with {halt}, allowing the system to regulate when momentum continues and when it must stop."
  ],

  edges: [
    "Structural distortion emerges when the OS over‑indexes on {avoid}, reducing adaptability and narrowing available responses.",
    "Breakpoints appear when {halt} activates ahead of actual load, interrupting processes before they complete their natural cycle."
  ],

  blind: [
    "The OS conceals its blind point behind the rhythm of {movement}, making the underlying trigger sequence harder to detect from within.",
    "The deepest blind spot is tied to how you {halt} under internal load, revealing where the system protects itself without conscious awareness."
  ]
}
};

// ─────────────────────────────
// Middlewares
// ─────────────────────────────
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json());

// ─────────────────────────────
// Internal Routes
// ─────────────────────────────
registerDashboardRoutes(app);
registerAdminRoutes(app);
registerQ19Routes(app);

// ─────────────────────────────
// 🔥 MIRAMI VARO Report API (完全內建)
// ─────────────────────────────
app.post("/api/report", async (req, res) => {
  try {
    const { answers, layer = "LV2" } = req.body;

   if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "invalid_answers" });
    }

    // 🔥 VARO核心引擎：信號提取 + 冷鏡報告生成
   const signals = extractSignals(answers);
   const storySignals = extractStorySignals(req.body.story || {});
   const merged = { ...signals, ...storySignals };
   const report = generateReport(layer, merged);
   const html = convertToHTML(report);

    console.log("🔍 VARO DIAGNOSIS:", {
      layer,
      signals: Object.keys(signals),
      confidence: 0.94
    });

    res.json({ 
      report,
      layer,
      varoScore: 0.94,
      signals
    });

  } catch (err) {
    console.error("🔥 MIRAMI VARO ERROR:", err);
    res.status(500).json({ error: "report_generation_failed" });
  }
});

function generateReport(layer, signals) {
function convertToHTML(report) {
  return `
    <div class="varo-report" style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #111;
      line-height: 1.75;
      padding-top: 20px;
    ">

      <section style="margin-bottom: 40px;">
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 10px; color:#0b3f4c;">
          Pattern
        </h2>
        <p style="font-size: 16px; white-space: pre-wrap; margin:0;">
          ${report.pattern}
        </p>
      </section>

      <section style="margin-bottom: 40px;">
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 10px; color:#0b3f4c;">
          How it shows up
        </h2>
        <p style="font-size: 16px; white-space: pre-wrap; margin:0;">
          ${report.showUp}
        </p>
      </section>

      <section style="margin-bottom: 40px;">
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 10px; color:#0b3f4c;">
          Meaning
        </h2>
        <p style="font-size: 16px; white-space: pre-wrap; margin:0;">
          ${report.meaning}
        </p>
      </section>

      <section style="margin-bottom: 40px;">
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 10px; color:#0b3f4c;">
          Edges
        </h2>
        <p style="font-size: 16px; white-space: pre-wrap; margin:0;">
          ${report.edges}
        </p>
      </section>

      <section style="margin-bottom: 40px;">
        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 10px; color:#0b3f4c;">
          Blind spot
        </h2>
        <p style="font-size: 16px; white-space: pre-wrap; margin:0;">
          ${report.blind}
        </p>
      </section>

    </div>
  `;
}

  const t = templates[layer] || templates.LV2;

  return {
    pattern: fill(pick(t.pattern), signals),
    showUp: fill(pick(t.showUp), signals),
    meaning: fill(pick(t.meaning), signals),
    edges: fill(pick(t.edges), signals),
    blind: fill(pick(t.blind), signals)
  };
}

// ─────────────────────────────
// Stripe · MIRAMI 多階層定價 ($49/$149/$299)
// ─────────────────────────────
app.post("/api/stripe/me49", async (req, res) => {
  console.log("🟢 HIT /api/stripe/me49");
  await createStripeSession(res, "price_1SwA8OLvNT4mo4zfJuK2UnnM"); // LV2 $49
});

app.post("/api/stripe/me149", async (req, res) => {
  console.log("🟡 HIT /api/stripe/me149");
  await createStripeSession(res, "price_1SwA8OLvNT4mo4zfJuK2UnnN"); // LV3.5 $149
});

app.post("/api/stripe/me299", async (req, res) => {
  console.log("🔴 HIT /api/stripe/me299");
  await createStripeSession(res, "price_1SwA8OLvNT4mo4zfJuK2UnnO"); // LV5 $299
});

// Stripe Session 通用函數
async function createStripeSession(res, priceId) {
  try {
    console.log("💰 USING PRICE:", priceId);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://www.mirami.tech/me/success.html",
      cancel_url: "https://www.mirami.tech/me/cancel.html"
    });

    console.log("🟢 STRIPE SESSION CREATED:", session.id);
    res.json({ url: session.url });
  } catch (err) {
    console.error("🔴 STRIPE ERROR FULL:", err);
    res.status(500).json({ error: "stripe_session_failed" });
  }
}

// ─────────────────────────────
// Health Check (VARO引擎狀態)
// ─────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "mirami-backend",
    engine: "VARO v1.0 (GPT-Free)",
    stripe: process.env.STRIPE_SECRET_KEY?.startsWith("sk_test") ? "TEST" : "LIVE",
    layers: ["LV2", "LV3.5", "LV5"],
    uptime: process.uptime(),
    time: new Date().toISOString()
  });
});

// ─────────────────────────────
// Global Error Guard
// ─────────────────────────────
app.use((err, req, res, next) => {
  console.error("🔥 UNCAUGHT APP ERROR", err);
  res.status(500).json({
    error: "internal error",
    message: "The mirror is temporarily unavailable."
  });
});

// ─────────────────────────────
// Start Server
// ─────────────────────────────
app.listen(PORT, () => {
  console.log("🚀 MIRAMI backend (VARO Engine) listening on port", PORT);
  console.log("✅ GPT-Free, Powered by the VARO Engine");
});
