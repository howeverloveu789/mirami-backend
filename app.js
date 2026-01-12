const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { registerQ19Routes } = require("./src/api/q19Routes");

const app = express();

// 🔒 MIRAMI 固定 Port（不使用 env）
const PORT = 10000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
registerQ19Routes(app);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "mirami-backend",
    time: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log("🚀 MIRAMI backend listening on port", PORT);
});
