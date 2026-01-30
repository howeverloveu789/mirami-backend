// MIRAMI Free Version — F/M Tone Reinforced
// 1 Layer: Core Mirror (F+M)

const { MIRAMI_CORE } = require("./miramiCore.engine.js");

function runFreeVersion(userInput = "") {
  return `
========================
MIRAMI — FREE VERSION
Core Mirror (1 Layer)
========================

[F] I’m receiving what you shared. You don’t need to refine it or make it sound better. Your words already show the emotional surface of where you are.

[M] When we look at your input structurally, three elements appear. These are not judgments, but patterns that emerge when your words are treated as data rather than emotion.

------------------------
SECTION 1 — Core Mirror
------------------------

[F] Emotionally, your input suggests:
- You are carrying something heavier than what you express externally.
- You are trying to understand your own reactions.
- You sense a shift happening, even if you can’t fully name it yet.

[M] Structurally, your behavior shows three consistent components:
1. **Action Pattern**  
   The way you move through situations has a recognizable rhythm, even if you don’t consciously track it.

2. **Reaction Pattern**  
   Under pressure, your system activates a predictable response loop.

3. **Surface Explanation vs Structural Cause**  
   What you describe as “the problem” may sit above a deeper structural layer.

------------------------
USER INPUT
------------------------
${userInput}

------------------------
UPGRADE OPTION
------------------------
To see your full 3-layer structure  
(Core Mirror + Behavior Loops + Life Theme),  
you can unlock the MIRAMI $19 version.
  `.trim();
}

module.exports = { runFreeVersion };
