console.log("🚨 APP VERSION CHECK:", __filename);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const OpenAI = require("openai");

const { registerQ19Routes } = require("./src/api/q19Routes");
const { registerDashboardRoutes } = require("./src/api/q19Dashboard");
const { registerAdminRoutes } = require("./src/api/q19Admin");

const app = express();

// ─────────────────────────────
// Config
// ─────────────────────────────
const PORT = process.env.PORT || 10000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
// MIRAMI AI Report API
// ─────────────────────────────
app.post("/api/report", async (req, res) => {
  try {
    const answers = req.body.answers;

    if (!answers || !Array.isArray(answers) || answers.length !== 19) {
      return res.status(400).json({ error: "invalid_answers" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: process.env.MIRAMI_REPORT_PROMPT },
        { role: "user", content: `User answers: ${answers.join(", ")}` }
      ]
    });

    const report = completion.choices[0].message.content;
    res.json({ report });
  } catch (err) {
    console.error("🔥 MIRAMI REPORT ERROR:", err);
    res.status(500).json({ error: "report_generation_failed" });
  }
});

// ─────────────────────────────
// Stripe · MIRAMI $49 Checkout
// ─────────────────────────────
app.post("/api/stripe/me49", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1SvvY1LvNT4mo4zfxshA6hu9",
          quantity: 1
        }
      ],
      success_url: "http://www.mirami.tech/me/success.html",
      cancel_url: "http://www.mirami.tech/me/cancel.html",
});

    res.json({ url: session.url });
  } catch (err) {
    console.error("🔥 STRIPE ME49 ERROR:", err);
    res.status(500).json({ error: "stripe_session_failed" });
  }
});

// ─────────────────────────────
// Health Check
// ─────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "mirami-backend",
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
  console.log("🚀 MIRAMI backend listening on port", PORT);
});
