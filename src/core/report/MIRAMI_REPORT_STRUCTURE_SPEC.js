/**
 * VERSION: A_FINAL_v1 (Locked)
 * Do not modify without bumping version
 *
 * MIRAMI Report Structure Spec
 * Version: v2 (LOCKED)
 *
 * Purpose:
 * Ensure MIRAMI reports remain structural, positional,
 * and free of interpretation or guidance.
 */

module.exports = {
  version: "v2_locked",

  purpose: `
Ensure MIRAMI reports remain structural, positional,
and free of interpretation or guidance.
`,

  coreRule: {
    description: "Every paragraph must map to ONE structural function.",
    functions: [
      "positioning",
      "lived continuity",
      "load or limitation"
    ],
    note: `
If a paragraph does not locate the reader,
it must not be generated.
`
  },

  structureAnchor: {
    internalOnly: true,
    description: "Each report uses exactly ONE structure anchor, derived from the current state.",
    anchors: [
      "active_mode",
      "conflict_type",
      "misattribution"
    ],
    note: "These are NOT labels and are NOT user-facing."
  },

  writingOrder: {
    mandatory: true,
    steps: [
      "Present position (where the user is standing)",
      "Lived scene (how this position appears)",
      "Load / cost (what this position carries)",
      "Mirror stop (no resolution)"
    ]
  },

  prohibitions: {
    absolute: true,
    rules: [
      "explain causes",
      "suggest change",
      "predict outcomes",
      "label identity",
      "imply progress or regression"
    ]
  },

  reviewChecklist: [
    "The position is clear",
    "The mirror does not move forward",
    "The ending stops cleanly"
  ],

  end: "End of Spec"
};