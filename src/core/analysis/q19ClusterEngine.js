// === 完全對齊你專案的 q19ClusterEngine.js 最終版 ===

/**
 * Cluster Engine (v3.8)
 * - Uses axis_scores + distribution
 * - Returns cluster label + confidence
 */

function clusterFromDistribution(dist) {
  const { A, B, C } = dist;

  const max = Math.max(A, B, C);
  const diff = max - Math.min(A, B, C);

  let label = "mixed";

  if (max === A) label = "A_dominant";
  else if (max === B) label = "B_dominant";
  else if (max === C) label = "C_dominant";

  return {
    label,
    confidence: diff
  };
}

function clusterFromAxis(axis_scores) {
  const summary = {};

  for (const [axis, scores] of Object.entries(axis_scores)) {
    const max = Math.max(scores.A, scores.B, scores.C);
    if (max === scores.A) summary[axis] = "A";
    else if (max === scores.B) summary[axis] = "B";
    else summary[axis] = "C";
  }

  return summary;
}

function analyzeCluster({ distribution, axis_scores }) {
  return {
    distribution_cluster: clusterFromDistribution(distribution),
    axis_cluster: clusterFromAxis(axis_scores)
  };
}

module.exports = { analyzeCluster };