function buildDistribution(answers = {}) {
  const total = 28;
  let A = 0, B = 0, C = 0;

  for (const key of Object.keys(answers)) {
    const v = answers[key];
    if (v === "A") A++;
    else if (v === "B") B++;
    else if (v === "C") C++;
  }

  return {
    A: A / total,
    B: B / total,
    C: C / total
  };
}

module.exports = { buildDistribution };