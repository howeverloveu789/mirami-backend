# Q19 回饋流程說明（Feedback Flow）

這一份只管「報告出來之後，使用者的回饋去哪裡、用來做什麼」。

---

## 1. 會請使用者填什麼？

報告頁最下方有一個按鈕：

> 「告訴 MIRAMI 這份報告哪裡最準／最怪」

點下去後的表單（可以是 Notion / Typeform），只收三個欄位：

1. **最準的一句**（mostAccurateSentence）  
2. **最怪或最不像的一句**（mostWeirdSentence）  
3. **想補充的故事（選填）**（story）

可選欄位：

- `email`（選填，用於後續訪談）  
- `permissionToContact`（true/false）

---

## 2. 在系統裡怎麼存？

後端會把每一筆回饋，寫入 `experienceVault`（或未來專用的 feedback collection），結構建議如下：

```json
{
  "testId": "Q19",
  "reportId": "<optional>",
  "userId": "<optional or hashed>",
  "createdAt": "2026-01-02T21:10:00.000Z",
  "mostAccurateSentence": "……",
  "mostWeirdSentence": "……",
  "story": "……",
  "clientTier": 19
}
