const LV5_SIGNALS = {
  0: [
    { id: "R_ACUTE_ACTIVATION", line: "reaction", role: "primary" },
    { id: "ST_LOAD_TOLERANCE", line: "stability", role: "secondary" }
  ],
  1: [
    { id: "R_CLARITY_SHIFT", line: "reaction", role: "primary" },
    { id: "P_SIGNAL_REFRAME", line: "processing", role: "secondary" }
  ],
  2: [
    { id: "R_PARAMETER_RESPONSE", line: "reaction", role: "primary" },
    { id: "S_PARAMETER_ADAPT", line: "speed", role: "secondary" }
  ],
  3: [
    { id: "P_STRUCT_DECOMPOSE", line: "processing", role: "primary" },
    { id: "R_AMBIGUITY_TOLERANCE", line: "reaction", role: "secondary" }
  ],
  4: [
    { id: "P_CRITERIA_FORMATION", line: "processing", role: "primary" },
    { id: "ST_DECISION_STABILITY", line: "stability", role: "secondary" }
  ],
  5: [
    { id: "P_SIGNAL_FILTER", line: "processing", role: "primary" },
    { id: "S_INFO_THROUGHPUT", line: "speed", role: "secondary" }
  ],
  6: [
    { id: "S_START_ACTIVATION", line: "speed", role: "primary" },
    { id: "R_START_RESISTANCE", line: "reaction", role: "secondary" }
  ],
  7: [
    { id: "S_SWITCH_COST", line: "speed", role: "primary" },
    { id: "ST_SWITCH_RECOVERY", line: "stability", role: "secondary" }
  ],
  8: [
    { id: "S_COMPLETION_RATE", line: "speed", role: "primary" },
    { id: "P_SCOPE_LOCK", line: "processing", role: "secondary" }
  ],
  9: [
    { id: "ST_RHYTHM_RECOVERY", line: "stability", role: "primary" },
    { id: "S_RHYTHM_INERTIA", line: "speed", role: "secondary" }
  ],
  10: [
    { id: "ST_VARIANCE_CONTROL", line: "stability", role: "primary" },
    { id: "R_STRESS_REACTION", line: "reaction", role: "secondary" }
  ],
  11: [
    { id: "ST_BASELINE_INTEGRITY", line: "stability", role: "primary" },
    { id: "P_RESET_PROTOCOL", line: "processing", role: "secondary" }
  ]
};

module.exports = { LV5_SIGNALS };
