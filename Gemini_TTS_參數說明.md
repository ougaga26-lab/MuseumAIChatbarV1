# Gemini TTS 參數說明

> 適用模型：`gemini-3.1-flash-tts-preview`
> 試聽所有聲音：https://aistudio.google.com/generate-speech

---

## 一、在 worker.js 裡可以改的地方

```javascript
body: JSON.stringify({
  contents: [{ parts: [{ text: `[cheerful] ${text}` }] }],  // ← 語氣 tag
  generationConfig: {
    responseModalities: ['AUDIO'],
    speechConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: { voiceName: 'Aoede' },  // ← 聲音
      },
    },
  },
}),
```

---

## 二、聲音列表（30 種）

| 聲音名稱 | 風格描述 |
|---|---|
| **Aoede** ⭐ 目前使用 | Breezy and natural（清新自然） |
| Kore | Firm and confident（穩重自信） |
| Puck | Upbeat and energetic（活潑有活力） |
| Charon | Informative and clear（清晰易懂） |
| Fenrir | Excitable and dynamic（興奮動感） |
| Leda | Youthful and energetic（年輕有活力） |
| Zephyr | Bright and cheerful（明亮愉快） |
| Autonoe | Bright and optimistic（明亮樂觀） |
| Callirrhoe | Easy-going and relaxed（輕鬆隨和） |
| Despina | Smooth and flowing（流暢順滑） |
| Erinome | Clear and precise（清晰精準） |
| Gacrux | Mature and experienced（成熟穩重） |
| Laomedeia | Upbeat and lively（活潑生動） |
| Pulcherrima | Forward and expressive（前衛表現力強） |
| Sulafat | Warm and welcoming（溫暖親切） |
| Vindemiatrix | Gentle and kind（溫柔友善） |
| Achernar | Soft and gentle（輕柔溫和） |
| Achird | Friendly and approachable（友好親近） |
| Algenib | Gravelly texture（低沉粗獷） |
| Algieba | Smooth and pleasant（流暢悅耳） |
| Alnilam | Firm and strong（堅定有力） |
| Enceladus | Breathy and soft（氣息輕柔） |
| Iapetus | Clear and articulate（清楚有條理） |
| Orus | Firm and decisive（果斷堅定） |
| Rasalgethi | Informative and professional（專業知性） |
| Sadachbia | Lively and animated（活躍生動） |
| Sadaltager | — |
| Schedar | — |
| Umbriel | — |
| Zubenelgenubi | — |

**改法：** 把 `voiceName: 'Aoede'` 換成上面任一名稱即可。

---

## 三、Audio Tags 正確格式

> ⚠️ **重要：tag 要用方括號 `[ ]`，不是尖括號 `< >`**

```javascript
// ✅ 正確
`[cheerful] ${text}`

// ❌ 錯誤（沒有效果）
`<cheerful>${text}</cheerful>`
```

### 情緒類
| Tag | 效果 |
|---|---|
| `[cheerful]` | 開心愉快 ⭐ 目前使用 |
| `[happy]` | 開心 |
| `[excited]` | 興奮激昂 |
| `[enthusiastic]` | 充滿熱情 |
| `[amused]` | 愉快、有趣感 |
| `[interest]` | 好奇、感興趣 |
| `[calm]` | 平靜沉著 |
| `[serious]` | 嚴肅正式 |
| `[sad]` | 哀傷低沉 |
| `[angry]` | 憤怒激動 |
| `[fearful]` | 緊張害怕 |
| `[surprised]` | 驚訝 |

### 語速 / 停頓類
| Tag | 效果 |
|---|---|
| `[slow]` | 說慢一點 |
| `[fast]` | 說快一點 |
| `[short pause]` | 短暫停頓 |
| `[pause]` | 停頓 |

### 音量 / 方式類
| Tag | 效果 |
|---|---|
| `[whispers]` | 低聲耳語 |
| `[loud]` | 大聲 |
| `[asmr]` | ASMR 輕柔貼近感 |
| `[laughs]` | 笑聲 |
| `[sigh]` | 嘆氣 |

### 組合用法範例
```javascript
// 單一語氣
`[cheerful] ${text}`

// 部分加語氣
`歡迎光臨！[cheerful] 今天有什麼可以幫您的嗎？`

// 加停頓
`[calm] ${text} [short pause] 請問還有其他問題嗎？`
```

---

## 四、用自然語言控制（不用 Tag）

```javascript
`以親切溫暖的語氣說：${text}`
`說話像博物館導覽員，清楚且專業：${text}`
`說話速度稍慢，像在為長者解說：${text}`
`Say cheerfully: ${text}`
```

---

## 五、目前 worker.js 設定

| 參數 | 目前值 | 說明 |
|---|---|---|
| 模型 | `gemini-3.1-flash-tts-preview` | 最新版 |
| 聲音 | `Aoede` | 清新自然 |
| 語氣 Tag | `[cheerful]` | 開心愉快（方括號格式）|
| 輸出格式 | WAV（24kHz, mono, 16-bit） | Web Audio API 相容 |

---

*參考：https://ai.google.dev/gemini-api/docs/speech-generation*
