/**
 * MIRAMI Engine Index (v4.1)
 * Central export hub for all engine modules
 */

module.exports = {
  free: require("./freeVersion.engine"),
  lite: require("./liteVersion.engine"),
  core: require("./miramiCore.engine"),

  // Main deterministic engine
  run: require("./runEngine").runEngine,

  // Q19 analysis engines
  trend: require("./q19TrendEngine"),
  cluster: require("./q19ClusterEngine"),
  reliability: require("./q19ReliabilityEngine"),
  signal: require("./q19SignalAnalyzer"),

  // Structural converters
 analyze: require("../analysis/analyzeQ19ToJSON"),
 quality: require("./evaluateQuality")
};
