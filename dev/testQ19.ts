import { runQ19 } from '../core/engine/runQ19';

const fakeAnswers: any = {};

// 隨便塞一些答案（A–D），先測流程
for (let i = 1; i <= 99; i++) {
  fakeAnswers[i] = 'C';
}

// 長文字題塞一點東西
fakeAnswers[62] = 'I changed direction too fast and regretted it.';
fakeAnswers[63] = 'I quit a stable plan because I felt bored.';

const result = runQ19(fakeAnswers);

console.log(JSON.stringify(result.report, null, 2));
