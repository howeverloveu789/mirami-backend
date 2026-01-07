// app.js
const express = require("express");
const cors = require("cors");

const { registerQ19Routes } = require("./src/api/q19Routes");

const app = express();
const PORT = process.env.PORT || 10000;

// middlewares
app.use(cors());
app.use(express.json());
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "mirami-backend",
    time: new Date().toISOString()
  });
});

// register modules
registerQ19Routes(app);

// health / root
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "mirami-backend",
    time: new Date().toISOString()
  });
});

// start server
app.listen(PORT, () => {
  console.log(`MIRAMI backend listening on port ${PORT}`);
});
