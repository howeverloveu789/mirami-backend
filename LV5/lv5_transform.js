function transformSignalsForLv5(raw) {
  const signals = raw.signals || [];

  const buckets = {
    reaction: [],
    processing: [],
    speed: [],
    stability: []
  };

  signals.forEach(sig => {
    if (buckets[sig.line]) {
      buckets[sig.line].push(sig.value);
    }
  });

  const avg = arr =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const osSummary = {
    reaction: avg(buckets.reaction),
    processing: avg(buckets.processing),
    speed: avg(buckets.speed),
    stability: avg(buckets.stability)
  };

  return { osSummary };
}

module.exports = { transformSignalsForLv5 };
