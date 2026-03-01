function buildLv5Payload(signals, userContext) {
  return {
    osSummary: signals.osSummary,
    userContext
  };
}

module.exports = { buildLv5Payload };
