import { computeEngine } from "../LV6/ENGINE/compute_engine.js";
import { semanticLayer } from "./semantic_layer.js";

export async function generateEL6Report(answers, gpt) {
  const engine = computeEngine(answers);

  const { primary_core, supporting_signals, collapse_model } =
    semanticLayer(engine);

  const prompt = `
Primary structural pattern: ${primary_core.label} (${primary_core.code}).
Strength: ${primary_core.strength}.

Supporting signals:
- Stability pattern: ${supporting_signals.stability_pattern}
- Compensation style: ${supporting_signals.compensation_style}
- Friction behavior: ${supporting_signals.friction_behavior}

Collapse model:
- Trigger: ${collapse_model.trigger_condition}
- Distortion path: ${collapse_model.distortion_path.join(" → ")}
- Threshold: ${collapse_model.failure_threshold}

Write a 6‑section EL6-style report:

1. Core Declaration
2. How This Core Operates
3. How It Amplifies Under Pressure
4. Where It Fails
5. Control Lever
6. Cold Conclusion

Rules:
- Engineering tone
- No psychology
- No personality language
- No moral framing
- No “you should”
- No softening
- Everything revolves around the primary core
- Supporting signals only reinforce the core
- No other themes
- No lists in the output
- No section titles, just 6 paragraphs
`;

  const response = await gpt(prompt);

  return {
    ok: true,
    primary_core,
    supporting_signals,
    collapse_model,
    report: response
  };
}
