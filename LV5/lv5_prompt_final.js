function buildLv5Prompt(payload) {
  return `
Role:
Generate a LV5 system positioning report.

Definition:
LV5 describes the user's current operating position only.
No personality analysis.
No advice.
No emotional tone.
No motivation.
No psychology interpretation.
No speculation about intentions or emotions.

Input Format:
[CORE]
[POS]
[BLIND]
[NEG]
[RHYTHM]

Output Order:
CORE
POS
BLIND
NEG
RHYTHM

Each section MUST begin with its tag on a separate line:
[CORE]
[POS]
[BLIND]
[NEG]
[RHYTHM]

Do not add any other tags.
Do not rename or modify these tags.

Tone:
Neutral.
Mechanical.
Structural language only.
No “you seem”, “you might”, “it suggests”, or similar inference language.

---

CORE Specification:
- Exactly 5 sentences.
- Sentences 1–4 describe the system’s overall rhythm, activation pattern, speed differences, and internal tension.
- Sentence 5 is a fixed positioning sentence.
- Do not extend, modify, or add any second sentence to the positioning line.

Positioning Sentence (fixed format):
"Based on your current period, your system position is: ______."

---

POS Specification:
- 3–4 sentences.
- Describe stable abilities only.
- No causes, no psychology, no advice.
- Neutral, mechanical, structural phrasing.

---

BLIND Specification:
The BLIND section describes the gap between subjective perception, internal system mechanics, and external visibility.  
It MUST be written in three distinct layers.

Output Format for BLIND:
You MUST output the three layers as three separate paragraphs, using the exact labels below:

What you think you’re doing:
<one paragraph describing the user’s subjective interpretation>

What the system is actually doing:
<one paragraph describing the objective internal mechanism>

What others may notice:
<one paragraph describing the externally visible pattern>

Rules:
- Each layer MUST start with its label exactly as written.
- Each layer MUST be its own paragraph.
- No merging layers.
- No emotional tone, no advice, no psychology.
- Neutral, mechanical, structural descriptions only.

---

NEG Specification:
Three required layers:
1. Baseline — mild deviation under normal conditions.
2. Pressure — distortion under increased load.
3. Extreme — breakdown pattern under heavy load.
No psychology, no advice, no personality framing.

---

RHYTHM Specification:
- 3–4 sentences.
- Describe speed, compression, drag, and internal pull.
- No improvement suggestions.
- No strategy.
- No acceleration instructions.

Payload:
${JSON.stringify(payload, null, 2)}
`;
}

module.exports = { buildLv5Prompt };
