import q19Config from '../../config/q19_thinking_99.json';

export type Q19Choice = 'A' | 'B' | 'C' | 'D';

export type Q19Answers = Record<number, Q19Choice>;

export interface Q19Scores {
  groups: Record<string, number>;
}

const SCALE = q19Config.answer_scale;
const GROUPS = q19Config.misjudgment_groups;

/**
 * Turn raw answers into per-group scores (0–1).
 */
export function scoreQ19(answers: Q19Answers): Q19Scores {
  const groups: Record<string, number> = {};

  for (const [groupName, ids] of Object.entries(GROUPS)) {
    const values: number[] = [];

    for (const id of ids as number[]) {
      const choice = answers[id];
      if (!choice) continue;
      const scaleEntry = SCALE[choice];
      if (!scaleEntry) continue;
      values.push(scaleEntry.score);
    }

    groups[groupName] =
      values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  return { groups };
}
