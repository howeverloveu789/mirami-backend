console.log("🚨 APP VERSION CHECK:", __filename);

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const cors = require("cors");
require("dotenv").config();

const { registerQ19Routes } = require("./src/api/q19Routes");

const app = express();
const { registerDashboardRoutes } = require("./src/api/q19Dashboard");
const { registerAdminRoutes } = require("./src/api/q19Admin");

registerDashboardRoutes(app);
registerAdminRoutes(app);
// 🔒 MIRAMI Port Strategy
// - Use env PORT when provided (deployment)
// - Fallback to 10000 for local/dev
const PORT = process.env.PORT || 10000;

// ─────────────────────────────
// Middlewares
// ─────────────────────────────

// CORS (open by default, can be tightened later)
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// Body parser
app.use(express.json());

// ─────────────────────────────
// Routes
// ─────────────────────────────
registerQ19Routes(app);
// Stripe Checkout (ME19)
app.post("/api/stripe/me19", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "ME — Your visible pattern" },
            unit_amount: 1900,
          },
          quantity: 1,
        },
      ],
      success_url: "https://www.mirami.tech/me/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://www.mirami.tech/me/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "stripe_error" });
  }
});

// ─────────────────────────────
// Health check (system-only)
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
// Global error guard (last line of defense)
// ─────────────────────────────
app.use((err, req, res, next) => {
  console.error("🔥 UNCAUGHT APP ERROR", err);

  res.status(500).json({
    error: "internal error",
    message: "The mirror is temporarily unavailable."
  });
});

// ─────────────────────────────
// Start server
// ─────────────────────────────
app.listen(PORT, () => {
  console.log("🚀 MIRAMI backend listening on port", PORT);
});
