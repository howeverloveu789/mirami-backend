// validation.js
// MIRAMI Final Validation Script — Clean JS Version

export function validateMIRAMIOutput(text = "") {
  const issues = [];

  // 1. Advice language
  const advicePatterns = [
    /you should/i,
    /you need to/i,
    /i suggest/i,
    /my advice/i,
    /you must/i,
    /you have to/i,
    /you ought to/i
  ];
  advicePatterns.forEach((pattern) => {
    if (pattern.test(text)) {
      issues.push(`Advice language detected: ${pattern}`);
    }
  });

  // 2. Therapy / psychology language
  const therapyPatterns = [
    /trauma/i,
    /healing/i,
    /therapy/i,
    /therapist/i,
    /inner child/i,
    /coping mechanism/i,
    /mental health/i,
    /diagnose/i,
    /symptom/i
  ];
  therapyPatterns.forEach((pattern) => {
    if (pattern.test(text)) {
      issues.push(`Therapy language detected: ${pattern}`);
    }
  });

  // 3. Fortune telling / prediction
  const predictionPatterns = [
    /you will/i,
    /your future/i,
    /destined/i,
    /fate/i,
    /meant to/i,
    /universe/i,
    /cosmic/i,
    /astrology/i
  ];
  predictionPatterns.forEach((pattern) => {
    if (pattern.test(text)) {
      issues.push(`Prediction language detected: ${pattern}`);
    }
  });

  // 4. Chatty AI tone
  const chattyPatterns = [
    /i'm here for you/i,
    /i care about you/i,
    /i understand how you feel/i,
    /you are not alone/i,
    /i'm proud of you/i,
    /i believe in you/i
  ];
  chattyPatterns.forEach((pattern) => {
    if (pattern.test(text)) {
      issues.push(`Chatty AI tone detected: ${pattern}`);
    }
  });

  // 5. Emotional reassurance
  const emotionalPatterns = [
    /everything will be okay/i,
    /it's going to be fine/i,
    /stay strong/i,
    /keep going/i,
    /you got this/i
  ];
  emotionalPatterns.forEach((pattern) => {
    if (pattern.test(text)) {
      issues.push(`Emotional reassurance detected: ${pattern}`);
    }
  });

  // 6. Missing F/M tone markers
// 6. Missing F/M tone markers
// 不用正則，直接用字串搜尋，最穩定
const hasF = text.includes("[F]");
const hasM = text.includes("[M]");

if (!hasF && !hasM) {
  issues.push("Missing F/M tone markers.");
}

  // 7. Final result
  if (issues.length === 0) {
    return {
      ok: true,
      message: "MIRAMI output passed all validation checks.",
      issues: []
    };
  }

  return {
    ok: false,
    message: "MIRAMI output contains issues.",
    issues
  };
}
