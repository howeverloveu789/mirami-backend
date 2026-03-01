// LV5 Mapping – map parsed sections to final structure

function mapLv5Output(sections) {
  return {
    core: sections.CORE.trim(),
    pos: sections.POS.trim(),
    blind: sections.BLIND.trim(),
    neg: sections.NEG.trim(),
    rhythm: sections.RHYTHM.trim()
  };
}

module.exports = { mapLv5Output };
