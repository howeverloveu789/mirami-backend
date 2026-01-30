/engine
  runEngine.js            # Q19 deterministic core (v4.1)
  analyzeQ19ToJSON.js     # structural analysis
  evaluateQuality.js      # quality engine (state-aware)
  autoSafeSendToMIRAMI.js # safe wrapper

/memory
  q19_memory.jsonl        # MEMORY v2
  q19_traces.jsonl        # TRACES v2
  behavior_vault.jsonl    # BLV1

/report
  sendToMIRAMI.js
  MIRAMI_ROUTING_MAP.js   # 12-module routing

/slot
  slotEngine.js           # (v4.1 新增) 尾段 slot 生成器
