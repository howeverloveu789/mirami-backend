/**
 * Q19 Evidence Mapping v1
 * Purpose:
 * - Prevent AI over-interpretation
 * - Separate signal vs noise
 * - Enforce analysis boundaries
 *
 * IMPORTANT RULES:
 * - core: may be used as primary evidence
 * - auxiliary: context only, never conclude
 * - control: must be ignored in analysis
 * - qualitative: cross-check only, never standalone
 */

const Q19_EVIDENCE_MAP = {
  core: [
    // Short-term result reaction / quit threshold
    1, 2, 3, 4, 5, 6, 7,

    // Compensation cycles / rhythm overshoot
    8, 9, 10, 11, 12, 13, 14,

    // Over-correction / dosage imbalance
    15, 16, 17, 18, 19, 20, 21,

    // Inertia / false stability
    22, 23, 24, 25, 26, 27,

    // Reverse improvement after stopping
    28, 29, 30, 31, 32, 33,

    // Context mismatch / environment sensitivity
    34, 35, 36, 37, 38, 39,

    // Perfectionism / marginal imbalance
    46, 47, 48, 49, 50, 51,

    // Pressure × cognition
    64, 65, 66,

    // Abstraction / system thinking
    67, 68, 69,

    // Order / stabilization preference
    70, 71, 72,

    // Internal optimization speed
    73, 74, 75,

    // Endurance / self-talk
    76, 77, 78,

    // Stimulation × performance
    82, 83, 84,

    // Time rhythm
    89, 90, 91
  ],

  auxiliary: [
    // External influence
    40, 41, 42, 43, 44, 45,

    // Long-term inertia / conservatism
    52, 53, 54, 55, 56, 57,

    // Recent pressure / seasonal effect
    58, 59,

    // Rule-following tendency
    60, 61,

    // Expression preference
    79, 80, 81,

    // Learning rhythm memory
    85, 86, 87, 88
  ],

  control: [
    // Control / trap questions
    92, 93, 94
  ],

  qualitative: [
    // Open-ended / human feedback
    62, 63,
    95, 96, 97, 98, 99
  ]
};

module.exports = {
  Q19_EVIDENCE_MAP
};
