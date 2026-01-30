/**
 * MIRAMI v3.7 — Variant Deduplicator
 *
 * 功能：
 * - 清理 A/B/C_variants.json 中的重複句子
 * - 移除高相似度句子（>85%）
 * - 移除 RED FLAG 污染
 * - 移除心理化 / 建議 / 情緒語氣
 * - 移除非該引擎語氣的句子
 * - 自動寫回乾淨版本
 */

const fs = require("fs");
const path = require("path");

const RED_FLAG_PREFIXES = [
  "The constraint least able",
  "If this rhythm continues",
  "If this protection is removed",
  "If this pattern holds",
  "What is least necessary to introduce"
];

const ENGINE_TONE = {
  A: ["forward", "momentum", "switching", "compressed", "activation"],
  B: ["suspension", "delayed", "paused", "evaluation", "monitoring"],
  C: ["reduced", "withdrawal", "exposure", "narrowed", "limited"]
};

function similarity(a, b) {
  const sa = a.toLowerCase().split(/\s+/);
  const sb = b.toLowerCase().split(/\s+/);

  const setA = new Set(sa);
  const setB = new Set(sb);

  const intersection = [...setA].filter(x => setB.has(x));
  const score = intersection.length / Math.max(setA.size, setB.size);

  return score;
}

function isValidVariant(text, engine) {
  if (!text) return false;

  // RED FLAG contamination
  if (RED_FLAG_PREFIXES.some(p => text.includes(p))) return false;

  // No advice
  if (text.includes("should") || text.includes("need to")) return false;

  // No emotions
  if (text.includes("feel") || text.includes("worry")) return false;

  // Must contain engine tone
  const tone = ENGINE_TONE[engine];
  if (!tone.some(w => text.includes(w))) return false;

  return true;
}

function dedupeList(list, engine) {
  const cleaned = [];

  for (const line of list) {
    if (!isValidVariant(line, engine)) continue;

    const isDuplicate = cleaned.some(existing => {
      const score = similarity(existing, line);
      return score > 0.85;
    });

    if (!isDuplicate) {
      cleaned.push(line);
    }
  }

  return cleaned;
}

function dedupeVariantsFile(engine) {
  const filePath = path.join(__dirname, "variants", `${engine}_variants.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const cleaned = {};

  for (const section of Object.keys(data)) {
    cleaned[section] = dedupeList(data[section], engine);
  }

  fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), "utf-8");

  return cleaned;
}

module.exports = { dedupeVariantsFile };