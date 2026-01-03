# 🥷 MIRAMI MOAT MAP
## （工程師專用 · 非執行文件 · 不可刪）

本文件定義 MIRAMI 的**隱藏護城河結構**。
它不被任何程式 require，
但**所有核心設計都必須遵守它**。

---

## 🎯 系統核心定位（一句話）

MIRAMI 是一個：
> **結構揭露系統（Structure Revelation System）**  
> 而不是建議系統（Advice System）

---

## 🧱 系統責任切割（不可混合）

| 層級 | 做什麼 | 絕對不做 |
|----|----|----|
| questions | 題目本體 | 不算分 |
| scoring | 算數字（0–1） | 不解釋 |
| decision gate | 判斷能不能往下 | 不產內容 |
| engines | 結構揭露 | 不給建議 |
| protocol | 最終輸出縮放 | 不分析 |
| storage | 自動存檔 | 不判斷 |

⚠️ **任何模組不得同時「算分 + 說話」**

---

## 🔒 VARO（三段式防 GPT 自我誤判）

### 1️⃣ 數值層（只算）
- 檔案：`engine/scoring/confidenceScore.js`
- 職責：輸出 0–1 數字
- 禁止：語言、判斷、解釋

### 2️⃣ 閘門層（只判）
- 檔案：`engine/core/decisionGateEngine.js`
- 職責：`true / false`
- 禁止：任何內容生成

### 3️⃣ 守門層（只縮）
- 檔案：`engine/protocol/protocolResponse.guard.js`
- 規則：
  - `!canProceed → minimal output`
  - `canProceed → safe output`

👉 GPT **不知道 VARO 存在**
👉 但永遠無法越權

---

## 🎭 P 層（人味放大器，但不思考）

- Prompt：`engine/prompts/p-system prompt.txt`
- 鎖權：`engine/prompts/GPT_ROLE_LOCK.md`
- 交接說明：`engine/architecture/handoff_varo_to_p.md`

P 可以：
- 比喻
- 時間梯度
- 情緒語感

P 不可以：
- 判斷
- 給建議
- 推導結論

---

## 🧠 VALUE 自曝機制（用戶自己講真相）

- 題目：
  - `questions/q19_thinking.json`
  - `questions/q49_rhythm.json`
- API：
  - `api/experience/experience.router.js`
- 存檔：
  - `infra/experienceVault.js`

👉 真相來自使用者，不來自 AI

---

## 🗄️ 護城河資料庫（時間複利）

- 檔案：`engine/storage/moatVault.js`
- 功能：
  - 自動存最近 500 筆
  - 不參與任何判斷
  - 只用於未來演化

---

## 🛡️ 合規硬邊界

- 禁詞表：`engine/guards/mirami_guardrail_v1.txt`
- Runtime：`engine/guards/guardrail_runtime.txt`
- 文件：`engine/docs/AI_SAFETY_GUARD.md`

---

## 🧠 工程鐵律（不可違反）

- 系統永遠寧願「講少」
- 不追求完整，只追求不翻車
- 所有價值必須被「藏起來跑」

---

## 🥷 最後一句（記住就好）

競品看到的是：
>「普通 AI 報告」

工程事實是：
>「六層防禦 × VARO × 時間複利 × 合規永固」
