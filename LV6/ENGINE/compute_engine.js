import fs from "fs";
import path from "path";

import * as fcore from "./F_core.js";
import * as dark from "./dark_patterns.js";

const base = path.join(process.cwd(), "LV6", "ENGINE");
const modulesData = JSON.parse(fs.readFileSync(path.join(base, "modules.json"), "utf8"));
const modules = modulesData.modules;

export function computeEngine(answers) {
  const result = {};

  // -----------------------------------------
  // 1. LV6 向量累積器
  // -----------------------------------------
  const accum = { L1:0, L2:0, L3:0, L4:0, L5:0, L6:0, L7:0 };

  const explore = { L1:0, L2:0, L3:0, L4:0, L5:0, L6:0, L7:0 };
  const mvp     = { L1:0, L2:0, L3:0, L4:0, L5:0, L6:0, L7:0 };
  const pressure= { L1:0, L2:0, L3:0, L4:0, L5:0, L6:0, L7:0 };
  const scale   = { L1:0, L2:0, L3:0, L4:0, L5:0, L6:0, L7:0 };

  answers.forEach((ans, index) => {
    const module = modules[index];
    if (!module) return;

    const option = module.options[ans.value];
    if (!option) return;

    const vec = option.vector || {};

    // 累積總向量
    for (const axis in accum) {
      accum[axis] += vec[axis] ?? 0;
    }

    // Stage 分配
    const primary = module.forceAxisPrimary;
    const secondary = module.forceAxisSecondary;
    const semantic = module.semanticAxis;

    explore[semantic] += vec[semantic] ?? 0;
    mvp[secondary] += vec[secondary] ?? 0;
    pressure[primary] += vec[primary] ?? 0;

    scale[primary] += vec[primary] ?? 0;
    scale[secondary] += vec[secondary] ?? 0;
  });

  result.vector_sum = accum;

  // -----------------------------------------
  // 2. baseline force-field
  // -----------------------------------------
  result.tension_threshold = fcore.TENSION;
  result.shift_direction = fcore.SHIFT;
  result.shift_velocity = fcore.VARIATION;
  result.stability_window = fcore.RECOVERY;
  result.compensation_loop = fcore.COMP;
  result.break_pattern = fcore.BREAK;
  result.temporal_resistance = fcore.TEMPORAL;

  // -----------------------------------------
  // 3. Stage engine
  // -----------------------------------------
  result.explore_load = explore;
  result.mvp_load = mvp;
  result.pressure_load = pressure;
  result.scale_load = scale;

  // -----------------------------------------
  // 4. Dark Engine
  // -----------------------------------------

  // 4.1 Transition Condition
  const transition_score =
      accum.L3 * 0.4 +
      accum.L4 * 0.3 -
      accum.L1 * 0.2 +
      accum.L7 * 0.3;

  result.transition_condition =
      transition_score > 0 ? "TRANSITION_ACTIVE" : "TRANSITION_STABLE";

  // 4.2 Failure Mechanism
  let failure = "NONE";

  if (accum.L3 + fcore.BREAK.L3 > 0.8) failure = "Variation_Break";
  if (accum.L4 + fcore.BREAK.L4 > 0.8) failure = "Shift_Break";
  if (accum.L1 + fcore.BREAK.L1 < -0.3) failure = "Tension_Break";
  if (accum.L7 + fcore.BREAK.L7 < -0.3) failure = "Temporal_Break";

  result.failure_mechanism = failure;

  // 4.3 Compensation State
  const comp_score =
      fcore.COMP.L5 * 0.5 +
      accum.L5 * 0.5 +
      accum.L2 * 0.2;

  if (comp_score > 0.5) result.compensation_state = "COMP_ACTIVE";
  else if (comp_score < -0.5) result.compensation_state = "COMP_COLLAPSED";
  else result.compensation_state = "COMP_NEUTRAL";

  // -----------------------------------------
  // 5. dark pairs baseline
  // -----------------------------------------
  result.dark_pairs = dark.pairs;

  // -----------------------------------------
  // 6. 輸出
  // -----------------------------------------
  fs.writeFileSync(
    path.join(base, "engine_output.json"),
    JSON.stringify(result, null, 2),
    "utf8"
  );

  return result;
}
