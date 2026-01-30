// === 完全對齊你專案的 analyzeQ19ToJSON.js 最終版 ===

const { buildAxisScores } = require("./q19AxisBuilder");
const { evaluateReliability } = require("../engine/q19ReliabilityEngine");
const { analyzeSignals } = require("../engine/q19SignalAnalyzer");
const { analyzeTrend } = require("../engine/q19TrendEngine");
const { analyzeCluster } = require("../engine/q19ClusterEngine");

function analyzeQ19ToJSON(answers = {}, session_id = null) {
  // 1. State detection
  let A = 0, B = 0, C = 0;
  for (const v of Object.values(answers)) {
    if (v === "A") A++;
    else if (v === "B") B++;
    else if (v === "C") C++;
  }

  let state = "A";
  if (B >= A && B >= C) state = "B";
  if (C >= A && C >= B) state = "C";

  // 2. Axis scores
  const axis_scores = buildAxisScores(answers);

  // 3. Reliability
  const reliability = evaluateReliability(answers);

  // 4. Signals + deltas
  const { signals, deltas } = analyzeSignals(answers);

  // 5. Trend (if session_id provided)
  const trend = session_id ? analyzeTrend(session_id) : null;

  // 6. Cluster
  const cluster = analyzeCluster({
    distribution: {
      A: A / 28,
      B: B / 28,
      C: C / 28
    },
    axis_scores
  });

  // 7. Structural slots
  const slots = {
    mainDomain: "Work",
    mainLoad: "Time",
    redFlagLoad: "additional pressure",
    userQuote: "multiple demands occurring at the same time",
    engine: state
  };

  return {
    state,
    slots,
    axis_scores,
    reliability,
    signals,
    deltas,
    trend,
    cluster,
    snapshot: {
      main_patterns: [],
      core_rhythm: null,
      five_beat_rhythm: [],
      traffic_light: null,
      cost_carrier: []
    }
  };
}

module.exports = { analyzeQ19ToJSON };