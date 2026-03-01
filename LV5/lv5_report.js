function buildLv5Report(mapped) {
  return {
    core: mapped.core,
    pos: mapped.pos,
    blind: mapped.blind,
    neg: mapped.neg,
    rhythm: mapped.rhythm
  };
}

module.exports = { buildLv5Report };
