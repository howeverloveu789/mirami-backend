// MIRAMI v3.8 — 12-module routing map
// q19 only accepts lowercase keys

const MIRAMI_ROUTING_MAP = {
  // -----------------------------
  // FREE TIER (0)
  // -----------------------------
  "q19_free_a": {
    file: "MIRAMI_BODY_FREEA_SNAPSHOT.json",
    layer: 0,
    angle: "A"
  },
  "q19_free_b": {
    file: "MIRAMI_BODY_FREEB_INTERACTION.json",
    layer: 0,
    angle: "B"
  },
  "q19_free_c": {
    file: "MIRAMI_BODY_FREEC_LOOP.json",
    layer: 0,
    angle: "C"
  },

  // -----------------------------
  // $19 TIER — 行為鏡
  // -----------------------------
  "q19_19a": {
    file: "MIRAMI_BODY_19A_SNAPSHOT.json",
    layer: 19,
    angle: "A"
  },
  "q19_19b": {
    file: "MIRAMI_BODY_19B_INTERACTION.json",
    layer: 19,
    angle: "B"
  },
  "q19_19c": {
    file: "MIRAMI_BODY_19C_LOOP.json",
    layer: 19,
    angle: "C"
  },

  // -----------------------------
  // $49 TIER — 理由鏡
  // -----------------------------
  "q19_49a": {
    file: "MIRAMI_BODY_49A_LOGIC.json",
    layer: 49,
    angle: "A"
  },
  "q19_49b": {
    file: "MIRAMI_BODY_49B_TRIGGER.json",
    layer: 49,
    angle: "B"
  },
  "q19_49c": {
    file: "MIRAMI_BODY_49C_BIAS.json",
    layer: 49,
    angle: "C"
  },

  // -----------------------------
  // $79 TIER — 真相鏡
  // -----------------------------
  "q19_79a": {
    file: "MIRAMI_BODY_79A_OS.json",
    layer: 79,
    angle: "A"
  },
  "q19_79b": {
    file: "MIRAMI_BODY_79B_ENGINE.json",
    layer: 79,
    angle: "B"
  },
  "q19_79c": {
    file: "MIRAMI_BODY_79C_FATELOOP.json",
    layer: 79,
    angle: "C"
  }
};

module.exports = MIRAMI_ROUTING_MAP;
