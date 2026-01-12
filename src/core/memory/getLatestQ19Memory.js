const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../../../data/q19_memory.jsonl");

function getLatestQ19Memory(session_id = null) {
  if (!fs.existsSync(FILE)) return null;

  const lines = fs.readFileSync(FILE, "utf-8")
    .trim()
    .split("\n")
    .reverse();

  for (const line of lines) {
    try {
      const record = JSON.parse(line);
      if (!session_id || record.session_id === session_id) {
        return record;
      }
    } catch (e) {
      // skip broken line
    }
  }
  return null;
}

module.exports = {
  getLatestQ19Memory
};
