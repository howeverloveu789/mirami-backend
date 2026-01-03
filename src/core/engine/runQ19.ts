// src/core/engine/runQ19.ts

import q19Config from '../../config/q19_thinking_99.json';
import type { Q19Answers } from '../scoring/q19_scoring';
import { scoreQ19 } from '../scoring/q19_scoring';
import { buildQ19Report } from '../report/q19_report';

export function runQ19(answers: Q19Answers) {
  // 1) 算分數（含 9 組 misjudgment + composite 指標）
  const scoring = scoreQ19(answers);

  // 2) 用新版報告引擎組出完整報告
  const report = buildQ19Report(scoring, answers);

  // 3) 回傳給 API / 前端
  return {
    meta: q19Config.meta,
    scoring,
    report,
  };
}
