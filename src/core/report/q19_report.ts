// src/core/report/q19_report.ts

import type { Q19Answers, Q19Scores } from '../scoring/q19_scoring';

// 這裡 key 要跟 scoring 裡保持一致
export type MisjudgmentGroupKey =
  | 'patience_threshold'
  | 'rhythm_instability'
  | 'dosage_illusion'
  | 'signal_misread'
  | 'unable_to_stop'
  | 'environment_sensitive'
  | 'social_interference'
  | 'perfectionism'
  | 'inertia_dependence';

export interface GroupScore {
  key: MisjudgmentGroupKey;
  score: number;               // 0–1
  label: 'low' | 'mild' | 'medium' | 'high';
}

export interface IdentitySnippet {
  tag: string;
  title: string;
  paragraphs: string[];
}

export interface TrapSummary {
  key: MisjudgmentGroupKey;
  label: string;
  intensity: 'mild' | 'clear' | 'high';
  summary: string;
}

// 新增：思維節奏主 / 副路徑（對外不用解釋演算法）
export interface ThinkingRoutes {
  primary: {
    key: string;
    label: string;
  } | null;
  secondary: {
    key: string;
    label: string;
  }[];
}

export interface Q19Report {
  identityIntro: string[];
  identitySnippets: IdentitySnippet[];
  trapMap: TrapSummary[];
  thinkingProfile: string[];
  lifeScenes: string[];
  earlyWarnings: string[];
  thinkingRoutes: ThinkingRoutes; // 新欄位
}

/**
 * 主入口：由 runQ19.ts 呼叫
 * 保持舊簽名：scores + answers
 */
export function buildQ19Report(
  scores: Q19Scores,
  answers: Q19Answers
): Q19Report {
  const rawGroups: any =
    (scores as any).groups ||
    (scores as any).misjudgmentGroups ||
    [];

  const groups: GroupScore[] = rawGroups.map((g: any) => ({
    key: g.key as MisjudgmentGroupKey,
    score: g.score as number,
    label: g.label as 'low' | 'mild' | 'medium' | 'high',
  }));

  const identitySnippets = buildIdentitySnippets(scores, groups);
  const identityIntro = buildIdentityIntro(identitySnippets);
  const trapMap = buildTrapMap(groups);
  const thinkingProfile = buildThinkingProfile(scores, groups);
  const lifeScenes = buildLifeScenes(answers);
  const earlyWarnings = buildEarlyWarnings(groups);
  const thinkingRoutes = buildThinkingRoutes(identitySnippets);

  return {
    identityIntro,
    identitySnippets,
    trapMap,
    thinkingProfile,
    lifeScenes,
    earlyWarnings,
    thinkingRoutes,
  };
}

/**
 * 1) 身分感模組（節奏版）
 */
function buildIdentitySnippets(
  scores: Q19Scores,
  groups: GroupScore[]
): IdentitySnippet[] {
  const snippets: IdentitySnippet[] = [];

  const essenceGrabScore = (scores as any).essenceGrabScore ?? 0;
  const chaosToSystemScore = (scores as any).chaosToSystemScore ?? 0;
  const pressureFocusScore = (scores as any).pressureFocusScore ?? 0;
  const wasteSensitivityScore = (scores as any).wasteSensitivityScore ?? 0;

  const rhythmGroup = groups.find((g) => g.key === 'rhythm_instability');

  const isEssenceBuilder =
    essenceGrabScore >= 0.65 && chaosToSystemScore >= 0.55;

  const isRhythmSensitiveHighOutput =
    !!rhythmGroup && rhythmGroup.score >= 0.55 && pressureFocusScore >= 0.55;

  const isCostAwareProtector = wasteSensitivityScore >= 0.6;

  // 1. Essence‑First System Builder（節奏版）
  if (isEssenceBuilder) {
    snippets.push({
      tag: 'essence_builder',
      title: 'Essence‑First System Builder',
      paragraphs: [
        "Your answers show a brain that runs on an essence‑first rhythm: you calm down when the core makes sense, and you get restless when everything stays vague, slow, or scattered.",
        "When information is messy, your system actually warms up — it wants to compress noise into a few clear lines, turn loose pieces into a structure, and then move only when the map feels grounded.",
        "Used on purpose, this rhythm is extremely protective: it lets you save time, money, and emotional energy by designing systems once, instead of firefighting the same chaos over and over again.",
      ],
    });
  }

  // 2. Rhythm‑Sensitive High Output（節奏版）
  if (isRhythmSensitiveHighOutput) {
    snippets.push({
      tag: 'rhythm_sensitive',
      title: 'Rhythm‑Sensitive High Output',
      paragraphs: [
        'Your output is not constant; it is rhythm‑based. When timing, energy, and environment line up, you can move faster and deeper than most people around you.',
        'When the rhythm is off — too many switches, broken routines, or unclear timing — the same brain suddenly feels ten times heavier, and simple tasks start to drag.',
        'This does not mean you are fragile. It means your system is built for tuned‑in sprints, not random noise. When you protect a few stable anchors in your day, your high‑output rhythm comes back much more reliably.',
      ],
    });
  }

  // 3. Cost‑Aware Protector（節奏版）
  if (isCostAwareProtector) {
    snippets.push({
      tag: 'cost_aware_protector',
      title: 'Cost‑Aware Protector',
      paragraphs: [
        'Your brain quietly tracks cost in the background: time, energy, money, and emotional bandwidth. You hate waste more than you hate effort.',
        'Because of this, your rhythm tends to slow down in high‑cost situations — you think twice, you scan for hidden trade‑offs, and you notice when something will not be sustainable for future‑you.',
        'From the outside this can look picky or negative, but it is actually a protection pattern: your system is trying to keep your life running at a rhythm where you can still breathe, instead of paying for rushed decisions later.',
      ],
    });
  }

  return snippets;
}

/**
 * 思維節奏主 / 副使用路徑（只輸出結果，不解釋演算法）
 */
function buildThinkingRoutes(snippets: IdentitySnippet[]): ThinkingRoutes {
  if (!snippets.length) {
    return { primary: null, secondary: [] };
  }

  // 簡單規則：第一個 snippet 當主，其餘依原順序當副
  const [first, ...rest] = snippets;

  return {
    primary: first
      ? {
          key: first.tag,
          label: first.title,
        }
      : null,
    secondary: rest.map((s) => ({
      key: s.tag,
      label: s.title,
    })),
  };
}

/**
 * 2) 報告最前面的 2–3 句總結（節奏 framing）
 */
function buildIdentityIntro(snippets: IdentitySnippet[]): string[] {
  if (!snippets.length) {
    return [
      'This report is not here to tell you who you are. It is here to give you a clearer manual of how your brain runs when the rhythm of life speeds up, slows down, or keeps changing on you.',
    ];
  }

  const tags = snippets.map((s) => s.title).join(', ');

  return [
    'This report is not here to tell you who you are. It is here to give you a clearer manual of how your brain runs when the rhythm of life shifts around you.',
    `Using MIRAMI, Q19 reads a simple thing that most people never get language for: the kinds of rhythms and decision environments where your brain runs smoother. In this run, that looks like a blend of: ${tags}.`,
    'The goal is not to fix you into a smaller identity, but to help you use your own rhythm on purpose — so that daily choices, work, and relationships feel more in‑sync with the way your system already wants to move.',
  ];
}

/**
 * 3) 9 組誤判群組 → trap map（文案可後面再做節奏版）
 */
function buildTrapMap(groups: GroupScore[]): TrapSummary[] {
  return groups.map((group) => {
    const intensity =
      group.label === 'high'
        ? 'high'
        : group.label === 'medium'
        ? 'clear'
        : 'mild';

    const label = mapGroupKeyToLabel(group.key);
    const summary = buildTrapSentence(group);

    return { key: group.key, label, intensity, summary };
  });
}

function mapGroupKeyToLabel(key: MisjudgmentGroupKey): string {
  switch (key) {
    case 'patience_threshold':
      return 'Impatience with slow results';
    case 'rhythm_instability':
      return 'On–off life rhythm';
    case 'dosage_illusion':
      return '“More must be better” bias';
    case 'signal_misread':
      return 'Misreading early signals';
    case 'unable_to_stop':
      return 'Trouble stopping even when it works';
    case 'environment_sensitive':
      return 'Environment‑sensitive state';
    case 'social_interference':
      return 'Social pull on your decisions';
    case 'perfectionism':
      return 'Perfection over “good enough”';
    case 'inertia_dependence':
      return 'Stuck in old routines';
  }
}

function buildTrapSentence(group: GroupScore): string {
  const base = mapGroupKeyToLabel(group.key);

  // 低：幾乎沒什麼失衡
  if (group.label === 'low') {
    return `This doesn’t look like a major rhythm problem for you. ${base} only shows up lightly in your answers, usually without derailing your day.`;
  }

  // mild：偶爾失衡
  if (group.label === 'mild') {
    switch (group.key) {
      case 'patience_threshold':
        return 'When results move slowly, your internal tempo speeds up a bit — you start wanting to change the plan sooner than most people, but can still pull yourself back when you notice it.';
      case 'rhythm_instability':
        return 'Your daily rhythm can slide into on–off mode during busy weeks, but you still have enough anchors to pull yourself back when things start to feel scattered.';
      case 'dosage_illusion':
        return 'When something feels good or promising, you sometimes nudge the dosage up too quickly, but you usually notice the tension and step back before it fully overloads you.';
      case 'signal_misread':
        return 'You occasionally over‑react to early signals — both good and bad — which can tilt your rhythm a little off, but you tend to correct once more data shows up.';
      case 'unable_to_stop':
        return 'If something is working, you can keep going past the point of freshness, but on most days you are still able to pause and reset the rhythm when you choose to.';
      case 'environment_sensitive':
        return 'Changes in season, light, or environment nudge your state, but usually in mild ways that you can adapt to with small rhythm adjustments.';
      case 'social_interference':
        return 'Other people’s opinions and trends can briefly pull your decisions off your own rhythm, but you often notice the mismatch and find your way back.';
      case 'perfectionism':
        return 'You sometimes raise the bar higher than needed, which tightens your rhythm and adds pressure, but not so much that it fully locks you up.';
      case 'inertia_dependence':
        return 'You like familiar routines, and mild inertia can keep you in old patterns a bit longer than ideal, but you still shift when the mismatch becomes clear.';
      default:
        return `This is a mild pattern for you: ${base} shows up sometimes, especially when you’re tired or under pressure.`;
    }
  }

  // medium：清楚的「容易失衡節奏」
  if (group.label === 'medium') {
    switch (group.key) {
      case 'patience_threshold':
        return 'Slow results are a clear stress rhythm for you: when progress looks flat, your tempo jumps, and you’re more likely to switch paths before the effects have time to land.';
      case 'rhythm_instability':
        return 'Your natural tempo leans toward on–off cycles. After intense pushes, it is easy for your rhythm to crash, making it harder to keep steady, sustainable progress.';
      case 'dosage_illusion':
        return '“More must be better” is a clear rhythm trap for you: when something seems to work, you tend to add time, effort, or intensity faster than your system can comfortably carry.';
      case 'signal_misread':
        return 'Early signals pull your rhythm strongly. A small win or warning can make you speed up or change course in ways that later feel out of proportion to what really happened.';
      case 'unable_to_stop':
        return 'Once a rhythm feels right, stopping is hard — even when the original goal is already met. This makes it easy to cross the line from effective to exhausting without noticing.';
      case 'environment_sensitive':
        return 'Your internal state is clearly tuned to environment. Light, season, air, and travel can shift your rhythm enough that the same plan feels completely different on different days.';
      case 'social_interference':
        return 'Social input has real weight in your decisions. When the people or feeds around you change rhythm, your own tempo can follow, even when it doesn’t match your longer‑term direction.';
      case 'perfectionism':
        return 'Perfectionism quietly tightens your rhythm: the closer you get to “good enough,” the more pressure you feel to push for perfect, which keeps your system running hotter than it needs to.';
      case 'inertia_dependence':
        return 'Inertia is a clear rhythm pattern for you. Once a routine solidifies, your system prefers staying with it, even after the environment or your goals have already moved on.';
      default:
        return `This is a clear pattern for you: ${base} is one of the ways your rhythm quietly starts to leak energy if you don’t notice it early.`;
    }
  }

  // high：高風險節奏失衡
  switch (group.key) {
    case 'patience_threshold':
      return 'This is a high‑risk rhythm trap for you: when results don’t move fast enough, your system almost reflexively speeds up, switches methods, or abandons course, which can block you from compounding gains.';
    case 'rhythm_instability':
      return 'Your on–off rhythm is strong. In high‑pressure seasons, it can swing between overdrive and shutdown, making it hard to feel any stable middle speed unless you protect it on purpose.';
    case 'dosage_illusion':
      return 'When something feels promising, your system tends to jump straight to “more, faster, stronger”, often past the dosage your body, time, or relationships can actually hold.';
    case 'signal_misread':
      return 'Early signals almost run the show when stress is high. A few data points can make you re‑tune your whole rhythm in ways that later feel like over‑corrections.';
    case 'unable_to_stop':
      return 'Stopping is one of your hardest rhythm moves. When something works, you can push long past the point of diminishing returns, turning short‑term wins into long‑term fatigue.';
    case 'environment_sensitive':
      return 'Your rhythm is highly environment‑dependent. Light, air, noise, and context can swing your state so strongly that the same task feels like a different life on different days.';
    case 'social_interference':
      return 'Social rhythm strongly overrides your own. In stressful weeks, other people’s pace, opinions, or crises can hijack your decisions before you even notice your own tempo dropped out of the picture.';
    case 'perfectionism':
      return 'Perfectionism can lock your rhythm into a narrow, high‑tension band: always almost there, never allowed to land. Over time this eats focus, sleep, and joy, even when results look good on the outside.';
    case 'inertia_dependence':
      return 'Inertia is a high‑risk rhythm trap for you. Once a pattern is in place, your system keeps running it almost automatically, even when your environment, role, or body are asking for a new tempo.';
    default:
      return `This is a high‑risk rhythm trap for you: ${base} is very likely to drive your decisions during stressful weeks unless you actively reset the tempo.`;
  }
}

/**
 * 4) Thinking profile（節奏版）
 */
function buildThinkingProfile(
  scores: Q19Scores,
  groups: GroupScore[]
): string[] {
  const lines: string[] = [];

  const essenceGrabScore = (scores as any).essenceGrabScore ?? 0;
  const chaosToSystemScore = (scores as any).chaosToSystemScore ?? 0;
  const pressureFocusScore = (scores as any).pressureFocusScore ?? 0;

  if (essenceGrabScore >= 0.65) {
    lines.push(
      'You process life best when there is at least one clear line: a main task, a simple structure, or a visible next step. Once that line appears, your rhythm often shifts from stuck to surprisingly fast.'
    );
  }

  if (chaosToSystemScore >= 0.55) {
    lines.push(
      'Your system prefers turning chaos into checklists, flows, or simple rules. When loose pieces snap into a structure, your internal noise drops and your usable energy goes up.'
    );
  }

  if (pressureFocusScore >= 0.55) {
    lines.push(
      'Moderate pressure can sharpen your focus instead of breaking it, as long as the rhythm is not constantly chaotic. Too many sudden switches or unfinished tasks are what actually start to drain you.'
    );
  }

  if (!lines.length) {
    lines.push(
      'Your thinking style is more balanced than extreme. You shift between speeds and perspectives depending on the situation, rather than living at one fixed tempo.'
    );
  }

  return lines;
}

/**
 * 5) Life scenes：從長文字題抓故事
 */
function buildLifeScenes(answers: Q19Answers): string[] {
  const lines: string[] = [];

  const regret = (answers as any)[62];
  const impulsive = (answers as any)[63];

  if (regret) {
    lines.push(
      'In the story you shared about a decision you regretted 3 weeks later, notice how your system reacted fast to short‑term signals and only later saw the longer‑term cost.'
    );
  }

  if (impulsive) {
    lines.push(
      'Your example of an impulsive change that backfired shows the same pattern: once your system commits to a move, it goes all in — powerful when the direction is right, expensive when it isn’t.'
    );
  }

  if (!lines.length) {
    lines.push(
      'If you add a real example of a recent regret or impulsive change next time, this part of the report will use your own story as the mirror, not generic scenes.'
    );
  }

  return lines;
}

/**
 * 6) Early warnings：溫和提醒，非治療
 */
function buildEarlyWarnings(groups: GroupScore[]): string[] {
  const lines: string[] = [];

  const perfection = groups.find((g) => g.key === 'perfectionism');
  if (perfection && perfection.label === 'high') {
    lines.push(
      'On long projects or in close relationships, your perfectionism can quietly raise the tempo until no one — including you — can relax. Naming this early lets you protect quality without burning everyone out.'
    );
  }

  const rhythm = groups.find((g) => g.key === 'rhythm_instability');
  if (rhythm && rhythm.label !== 'low') {
    lines.push(
      'If you step into a season with less sleep or more responsibility (new job, moving, kids), your on–off rhythm will amplify. Protecting even one small daily anchor will matter more than chasing big changes.'
    );
  }

  if (!lines.length) {
    lines.push(
      'The more your life responsibilities grow, the more your existing patterns will simply turn up the volume. Seeing them now means you can protect future‑you instead of being surprised later.'
    );
  }

  return lines;
}
