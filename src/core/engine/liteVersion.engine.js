// MIRAMI $19 Version — 3 Layers + F/M Tone Reinforced

const { MIRAMI_CORE } = require("./miramiCore.engine.js");

function runLiteVersion(userInput = "") {
  return `
========================
MIRAMI — $19 VERSION
Three-Layer Structure
========================

[F] I’m receiving what you shared. You don’t need to refine it or make it sound better. Your words already reveal the emotional surface of where you are.

[M] When we treat your input as structure rather than emotion, three layers appear. These layers do not judge you; they simply show how your system organizes experience.

------------------------
SECTION 1 — Core Mirror
------------------------

[F] Emotionally, your input suggests:
- Something in your current situation feels heavier than what you express externally.
- You are trying to understand your own reactions.
- You sense a shift happening, even if you can’t fully name it yet.

[M] Structurally, your behavior shows three consistent components:
1. **Action Pattern**  
   The rhythm of how you move through situations.

2. **Reaction Pattern**  
   The loop that activates when pressure appears.

3. **Surface Explanation vs Structural Cause**  
   What you describe as “the problem” may sit above a deeper layer.

------------------------
SECTION 2 — Behavior Loops
------------------------

[F] The way you respond to repeated situations has a recognizable emotional texture. It’s not good or bad — it’s simply the pattern your system learned to use.

[M] When we map your behavior loops, three elements appear:
1. **Trigger → Activation**  
   What reliably starts the loop.

2. **Internal Processing**  
   The mechanism your system uses to stabilize itself.

3. **Outcome Pattern**  
   The result that tends to repeat, even when circumstances change.

------------------------
SECTION 3 — Life Theme
------------------------

[F] Beneath your reactions, there is a quieter theme — something that has been with you for a long time, shaping how you interpret situations.

[M] Structurally, your words point to a recurring theme:
- A long-term pattern that influences how you make sense of yourself.
- A tension between what you show and what you carry.
- A deeper question your system keeps returning to.

------------------------
SECTION 4 — MIRAMI LINE
------------------------

[F] If your input were distilled into one sentence, the emotional core would sound like this:
- “There is something I’m trying to understand about myself.”

[M] And structurally, the system-level summary is:
- “Your current behavior reflects a deeper pattern that is becoming visible.”

------------------------
USER INPUT
------------------------
${userInput}
  `.trim();
}

module.exports = { runLiteVersion };
