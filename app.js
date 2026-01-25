console.log("🚨 APP VERSION CHECK:", __filename);

const express = require("express");
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
