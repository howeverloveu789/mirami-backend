// LV5 Report GPT – parser only (five-section format)

function parseLv5Report(text) {
  const sections = {
    CORE: "",
    POS: "",
    BLIND: "",
    NEG: "",
    RHYTHM: ""
  };

  let current = null;
  const lines = text.split("\n");

  for (const line of lines) {
    if (line.startsWith("[CORE]")) { current = "CORE"; continue; }
    if (line.startsWith("[POS]")) { current = "POS"; continue; }
    if (line.startsWith("[BLIND]")) { current = "BLIND"; continue; }
    if (line.startsWith("[NEG]")) { current = "NEG"; continue; }
    if (line.startsWith("[RHYTHM]")) { current = "RHYTHM"; continue; }

    if (current) sections[current] += line + "\n";
  }

  return sections;
}

module.exports = { parseLv5Report };
