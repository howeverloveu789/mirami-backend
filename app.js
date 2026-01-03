// app.js

const express = require('express');
const cors = require('cors');
const { registerQ19Routes } = require('./src/api/q19Routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

registerQ19Routes(app);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'mirami-backend' });
});

app.listen(PORT, () => {
  console.log(`MIRAMI backend listening on port ${PORT}`);
});
