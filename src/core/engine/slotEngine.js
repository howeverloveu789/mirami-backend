/**
 * MIRAMI v4.1 — Slot Engine (Language-pack architecture)
 * ------------------------------------------------------
 * This engine:
 * - Loads language packs from /src/core/language
 * - Picks one line from the appropriate pool
 * - Returns pure strings (no interpretation, no side effects)
 */

const path = require("path");
const fs = require("fs");

function loadJson(relativePath) {
  const fullPath = path.join(__dirname, "..", "language", relativePath);
  const raw = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(raw);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* -------------------------------------------------------
 * 1. coreTriple — Native triple (A / B / C)
 * -----------------------------------------------------*/
const CORE = {
  A: loadJson("core/A.json"),
  B: loadJson("core/B.json"),
  C: loadJson("core/C.json")
};

function coreTriple(state) {
  const arr = CORE[state] || [];
  return arr.join(" ");
}

/* -------------------------------------------------------
 * 2. hybridTriple — Hybrid tones (AB / AC / BC)
 * -----------------------------------------------------*/
const HYBRID = {
  AB: loadJson("hybrid/AB.json"),
  AC: loadJson("hybrid/AC.json"),
  BC: loadJson("hybrid/BC.json")
};

function hybridTriple(state) {
  let key = "AB";
  if (state === "A") key = "AB";
  else if (state === "B") key = "BC";
  else if (state === "C") key = "AC";

  const arr = HYBRID[key] || [];
  return pick(arr);
}

/* -------------------------------------------------------
 * 3. reflectionSlot — Reflection (direction mismatch)
 *    Uses multiple pools: direction / mismatch / misfocus / wrong_problem / wrong_person / wrong_need
 * -----------------------------------------------------*/
const REFLECTION_POOLS = [
  loadJson("reflection/direction.json"),
  loadJson("reflection/mismatch.json"),
  loadJson("reflection/misfocus.json"),
  loadJson("reflection/wrong_problem.json"),
  loadJson("reflection/wrong_person.json"),
  loadJson("reflection/wrong_need.json")
];

function reflectionSlot() {
  const pool = pick(REFLECTION_POOLS);
  return pick(pool);
}

/* -------------------------------------------------------
 * 4. analogySlot — Everyday analogy
 *    tech / relationship / daily_life / communication / decision
 * -----------------------------------------------------*/
const ANALOGY_POOLS = [
  loadJson("analogy/tech.json"),
  loadJson("analogy/relationship.json"),
  loadJson("analogy/daily_life.json"),
  loadJson("analogy/communication.json"),
  loadJson("analogy/decision.json")
];

function analogySlot() {
  const pool = pick(ANALOGY_POOLS);
  return pick(pool);
}

/* -------------------------------------------------------
 * 5. punchline — Final signature line
 *    precision / direction / need / clarity / misalignment
 * -----------------------------------------------------*/
const PUNCHLINE_POOLS = [
  loadJson("punchline/precision.json"),
  loadJson("punchline/direction.json"),
  loadJson("punchline/need.json"),
  loadJson("punchline/clarity.json"),
  loadJson("punchline/misalignment.json")
];

function punchline() {
  const pool = pick(PUNCHLINE_POOLS);
  return pick(pool);
}

/* -------------------------------------------------------
 * Export
 * -----------------------------------------------------*/
module.exports = {
  coreTriple,
  hybridTriple,
  reflectionSlot,
  analogySlot,
  punchline
};
