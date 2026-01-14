/**
 * Distribution Gate — FINAL (ARRAY-ONLY)
 * 判斷是否進入「過渡鏡子」
 * ⚠️ 只接受 ["A","B","C"] array
 */

function isNeutralDistribution(answerArray = []) {
  console.log("🧪 [GATE] answerArray =", answerArray);

  if (!Array.isArray(answerArray) || answerArray.length === 0) {
    return true;
  }

  const counts = { A: 0, B: 0, C: 0 };

  answerArray.forEach(v => {
    if (v === "A" || v === "B" || v === "C") {
      counts[v]++;
    }
  });

  const total = answerArray.length;

  console.log("🧪 [GATE] counts =", counts, "total =", total);

  // ① 全 B → 一定過渡
  if (counts.B === total) return true;

  // ② ABC 接近平均（±15%）
  const avg = total / 3;
  const tolerance = total * 0.15;

  const nearAverage =
    Math.abs(counts.A - avg) <= tolerance &&
    Math.abs(counts.B - avg) <= tolerance &&
    Math.abs(counts.C - avg) <= tolerance;

  return nearAverage;
}

module.exports = {
  isNeutralDistribution
};
