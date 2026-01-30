const path = require("path");
const { scanPromptFolder } = require("../src/core/report/scanPromptForContamination");

const folder = path.join(__dirname, "../src/core/report/prompts/variants");

const results = scanPromptFolder(folder);

console.log("=== MIRAMI Prompt Scan Results ===");
console.log(JSON.stringify(results, null, 2));