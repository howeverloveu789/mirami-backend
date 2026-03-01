const { buildLv5Prompt } = require("./lv5_prompt_final.js");

function buildPrompt(payload) {
  return buildLv5Prompt(payload);
}

module.exports = { buildPrompt };
