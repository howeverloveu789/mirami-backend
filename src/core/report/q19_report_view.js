const crypto = require('crypto');
const { buildQ19Report } = require('./q19_report');

/**
 * Q19 View Builder
 * - Controls visible sections based on reliability gate
 * - Does not expose restriction logic to frontend or GPT
 */
function buildQ19View(scoring, answers, options = {}) {
  const {
    reportId,
    reliability = {
      level: 'low',
      analysis_mode: 'restricted',
      allowedSections: [],
      notice: null,
      confidence: null,
    },
  } = options;

  // === stable seed ===
  const seedSource =
    reportId || JSON.stringify({ groups: scoring.groups || [], answers });
  const seed = hashToInt(seedSource);

  // === restricted mode: neutral observation only ===
  if (reliability.analysis_mode === 'restricted') {
    return {
      P_MODE: 'Q19_RHYTHM_REPORT',
      LOCKED_20: true,
      primaryRhythm: null,
      reliability: {
        level: reliability.level,
        confidence: reliability.confidence,
      },
      sections: {
        pattern:
          'In this sitting, the observed thinking rhythm signals appear dispersed, without forming a stable pattern.',
        tension:
          'At the current data density, no specific rhythm tension stands out.',
        earlySignals:
          reliability.notice ||
          'What appears here is a record of this sitting, not a conclusion.',
      },
      core: null,
    };
  }

  // === full / limited modes ===
  const core = buildQ19Report(scoring, answers);
  const primary = core.thinkingRoutes?.primary || null;

  const sections = {};

  if (reliability.allowedSections.includes('pattern')) {
    sections.pattern = renderPattern(core, seed);
  }

  if (reliability.allowedSections.includes('tension')) {
    sections.tension = renderTension(core, seed + 1);
  }

  if (reliability.allowedSections.includes('earlySignals')) {
    sections.earlySignals = renderEarlySignals(core, seed + 2);
  }

  return {
    P_MODE: 'Q19_RHYTHM_REPORT',
    LOCKED_20: true,
    primaryRhythm: primary,
    reliability: {
      level: reliability.level,
      confidence: reliability.confidence,
    },
    sections,
    core, // preserved for internal use
  };
}

/* ======================
   Utilities
====================== */
function hashToInt(str) {
  const h = crypto.createHash('sha256').update(str).digest('hex');
  return parseInt(h.slice(0, 8), 16);
}

/* ======================
   Renderers
====================== */
function renderPattern(core, seed) {
  const primary = core.thinkingRoutes?.primary;
  const snippets = core.patternSnippets || core.identitySnippets || [];
  const titles = snippets.map((s) => s.title).join(', ');

  const templates = [
    () =>
      `In this sitting, the thinking process most often moves through “${
        primary?.label || 'this rhythm'
      }”, with the overall arrangement reflecting: ${titles}.`,
    () =>
      `During this sitting, “${
        primary?.label || 'this rhythm'
      }” appears most active, forming a composition similar to: ${titles}.`,
    () =>
      `If described in a single line, this sitting reflects “${
        primary?.label || 'this rhythm'
      }”, with attention arranged around: ${titles}.`,
  ];

  return pickBySeed(templates, seed)();
}

function renderTension(core, seed) {
  const tensions = core.trapMap || [];

  if (!tensions.length) {
    return 'In this sitting, no distinct rhythm tension stands out; most fluctuations appear related to load or context shifts.';
  }

  const highOrClear = tensions.filter(
    (t) => t.intensity === 'high' || t.intensity === 'clear'
  );
  const picked = (highOrClear.length ? highOrClear : tensions).slice(0, 2);

  const templates = [
    () =>
      `Within this sitting, rhythm shifts are most often associated with “${picked
        .map((t) => t.label)
        .join(', ')}”. These are not errors, but signals that tend to surface as pressure increases.`,
    () =>
      `If one rhythm signal appears more visible in this sitting, it relates to “${picked
        .map((t) => t.label)
        .join(', ')}”, where alignment loosens first under load.`,
  ];

  return pickBySeed(templates, seed)();
}

function renderEarlySignals(core, seed) {
  const lines = core.earlyWarnings || [];

  if (!lines.length) {
    return 'The signals observed in this sitting remain subtle, resembling amplification of pace rather than structural change.';
  }

  const templates = [
    () =>
      `In this sitting, early signals can already be observed, such as: ${lines.join(
        ' '
      )}`,
    () =>
      `Some initial signals are visible in this sitting, including: ${lines.join(
        ' '
      )}`,
  ];

  return pickBySeed(templates, seed)();
}

function pickBySeed(arr, seed) {
  const idx = Math.abs(seed) % arr.length;
  return arr[idx];
}

module.exports = {
  buildQ19View,
};
