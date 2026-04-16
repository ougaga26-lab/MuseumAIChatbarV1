# Gotour AI 智慧小助手｜產品規格書 V12

> 國立臺灣歷史博物館 AI 語音互動導覽工具
> 部署網址：https://ougaga26-lab.github.io/MuseumAIChatbarV1/
> 最後更新：2026/03/25

---

## 一、技術架構

### 前端
| 項目 | 說明 |
|---|---|
| 部署方式 | GitHub Pages（單一 HTML 檔案） |
| 3D 視覺引擎 | Three.js r128 + GLSL Custom Shader |
| 背景動畫 | 純 CSS `@property` conic-gradient 極光動畫 |
| 互動效果 | Canvas 互動點點矩陣（hover 發光） |
| 字體 | Noto Serif TC / Noto Sans TC（Google Fonts） |

### AI 與語音
| 項目 | 說明 |
|---|---|
| AI 模型 | Gemini 2.5 Flash |
| 語音辨識（STT） | Azure Speech Services（zh-TW） |
| 語音合成（TTS） | Azure Speech Services — zh-TW-YunJheNeural |
| API 代理 | Cloudflare Worker（`nmth-api-proxy.ougaga26.workers.dev`） |
| 知識庫架構 | RAG（System Prompt 注入，現為 Prototype 版本） |

### Cloudflare Worker 端點
| 端點 | 功能 |
|---|---|
| `/gemini` | 轉發 Gemini API 請求 |
| `/stt` | 轉發 Azure 語音辨識 |
| `/tts` | 轉發 Azure 語音合成 |

---

## 二、知識庫（KB）

### 目前資料筆數：38 筆（Prototype 版）
| 分類 | 筆數 |
|---|---|
| 開放時間 | 4 |
| 票價 / 優惠 / 退票 | 6 |
| 參觀須知 | 4 |
| 交通 | 3 |
| 停車 | 2 |
| 設施（廁所/哺乳室/電梯/服務台/餐廳/文創/停車場/入口） | 9 |
| 特展（3 檔） | 4 |
| 常設展 | 1 |
| VR | 1 |
| 聯絡 | 1 |
| 其他（湖畔圖書館/臺灣歷史公園） | 2 |

### System Prompt 規則
1. 只能根據知識庫回答，找不到答案回覆「我目前的資料沒有這個資訊，建議聯繫館方：06-356-8889」
2. 問題模糊主動反問
3. 語氣親切簡潔，繁體中文
4. 回答 2–4 句為佳
5. 禁止所有 Markdown 格式符號（`* ** # - ` 等），改用 `・` 列點
6. 生成設定：`maxOutputTokens: 600`，`temperature: 0.3`

---

## 三、特展資料

### 目前三檔特展

| 展覽名稱 | 展期 | 地點 |
|---|---|---|
| 轉機：臺灣女子移動紀事特展 | 2025/12/23 – 2026/08/30 | 4樓 第1特展室 |
| 地方記憶・遊牧：國家文化記憶庫社群合作成果展 | 2026/02/10 – 2026/05/31 | 1樓 大廳 |
| 開箱吧！臺史博館藏桌遊特展 | 2025/06/03 – 2026/04/26 | 4樓 第3特展室 |

### Banner 圖片路徑
```
https://raw.githubusercontent.com/ougaga26-lab/MuseumAIChatbarV1/main/banner/ex1banner.jpg
https://raw.githubusercontent.com/ougaga26-lab/MuseumAIChatbarV1/main/banner/ex2banner.jpg
https://raw.githubusercontent.com/ougaga26-lab/MuseumAIChatbarV1/main/banner/ex3banner.jpg
```

---

## 四、UI 結構

### 頁面佈局（由下到上 z-index）
| 層級 | 元素 | z-index |
|---|---|---|
| 0 | Aurora 極光背景（CSS） | 0 |
| 1 | 互動點點 Canvas | 1 |
| 2 | Three.js Orb Canvas | 2 |
| 3 | App UI 覆蓋層 | 3 |
| 9–10 | 抽屜 Overlay / 抽屜 | 9–10 |
| 20 | iOS 靜音提示 | 20 |

### Header
- 館名：「國立臺灣歷史博物館」15px Noto Serif TC，置中
- 狀態膠囊：「線上服務中」綠色閃爍圓點，毛玻璃背景

### 主標題
- 文字：「Gotour AI 智慧小助手」
- 樣式：26px，font-weight: 700，純白 `#ffffff`

### 狀態框（voice-label）
- 位置：Flexbox 自然夾在標題與球球之間，`margin-top: 20px`
- 樣式：黑底毛玻璃，border-radius: 6px，font-size: 10px
- 效果：打字機動態效果（每字 35ms）

### 狀態對應表
| 狀態 | 文字 | 顏色 | 圓點 |
|---|---|---|---|
| idle | 點擊球球詢問問題 | 白色 | 無 |
| listen | 聆聽中⋯ 再點停止 | 紅色 `#ff4444` | 紅色閃爍 |
| stt | 語音轉換文字中 | 黃色 `#ffcc00` | 黃色閃爍 |
| ai | AI 生成中 | 藍色 `#4488ff` | 藍色閃爍 |
| speak | AI 語音播放中 | 綠色 `#00ffcc` | 綠色閃爍 |

### 底部 Tab Bar
三個 icon 連成圓角膠囊（`border-radius: 28px`）：
- 💬 對話記錄（開啟聊天抽屜）
- ⊞ 展覽列表（開啟展覽抽屜）
- 🗺 園區地圖（開啟地圖抽屜）

---

## 五、Three.js Orb 球球

### 基本結構
- 三層透明球體疊加
- GLSL Simplex Noise 有機變形
- Fresnel 邊緣發光 + 彩虹色差（Chromatic Aberration）
- 玻璃透明材質 shader

### 四種狀態
| 狀態 | 顏色 | 行為 |
|---|---|---|
| idle | 青藍 `#00ffcc` / 藍 `#00aaff` / 紫 `#aa44ff` | 有機呼吸（pulsateMin: -0.45, Max: 0.65） |
| listening | 亮青藍系 | 脈動（pulsateMin: 0.02, Max: 0.28） |
| thinking | 紫色系 | 緩慢呼吸（pulsateMin: 0, Max: 0.15） |
| speaking | 粉紅系 `#ff66aa` | 快速跳動（pulsateMin: 0.05, Max: 0.25） |

---

## 六、功能模組

### 語音對話流程
```
使用者點球球
→ forceUnlockAudio()（解鎖 iOS 音訊硬體）
→ getUserMedia()（取得麥克風）
→ MediaRecorder 錄音（最長 10 秒）
→ convertToWav()（用 SharedAudioCtx + OfflineAudioContext 重採樣至 16kHz）
→ Azure STT（/stt）
→ callGemini()（/gemini）
→ Azure TTS（/tts）
→ Web Audio API 播放（decodeAudioData + createBufferSource）
```

### 音訊系統（iOS 修復方案）
- 全域共用 `sharedAudioCtx`（`window.AudioContext || window.webkitAudioContext`）
- `forceUnlockAudio()`：每次使用者手勢都播放靜音 buffer，強制喚醒 iOS 喇叭硬體
- 解鎖入口：點球球、送出按鈕、chip 按鈕、輸入框 focus / touchstart
- 錄音結束 `onstop` 後再次呼叫 `forceUnlockAudio()`，防止麥克風釋放後音訊重置
- `convertToWav()` 使用 `OfflineAudioContext` 重採樣，不另建第二個 AudioContext

### 意圖偵測（基於使用者問題字詞）
| 使用者問題包含 | 觸發行為 | 語音提示 |
|---|---|---|
| 展覽/特展/有哪些展… | 自動開啟展覽列表 | 「我幫您開啟展覽列表了，您可以參考。」 |
| 轉機/地方記憶/開箱吧… | 自動展開該展覽詳情 | 「我幫您開啟展覽資訊了，您可以參考。」 |
| 廁所/停車場/服務台/在哪裡… | 自動開啟園區地圖 | 「我馬上幫你開啟園區地圖。」 |

### 展覽列表抽屜
- 高度：40%（預設），展開詳情時 85%
- 橫向滑動卡片（scroll-snap）
- 每張卡：Banner 圖片 + 漸層遮罩文字 + 日期地點 + 展開說明按鈕
- 展開詳情：完整展覽介紹（含各展區說明）

### 園區地圖抽屜
- 高度：80%
- Tab 切換：臺灣歷史公園 / 室內地圖
- 支援：雙指縮放（1x–5x）、拖拉平移、+/− 按鈕、向下滑關閉

### 聊天抽屜
- 高度：64%
- 快速問題 chip（首次互動後隱藏）
- 支援文字輸入（Enter 送出）+ 語音輸入
- 對話氣泡：bot（青綠邊框）/ user（紫色邊框）
- 打字指示動畫（三點跳動）

### iOS 靜音提示
- 僅在 iOS 裝置顯示（User Agent 偵測）
- 每個裝置只顯示一次（localStorage 記錄）
- 5 秒後自動消失，點任意處立即關閉

---

## 七、地圖圖片路徑

```
https://raw.githubusercontent.com/ougaga26-lab/MuseumAIChatbarV1/main/maps/park-map.jpg
https://raw.githubusercontent.com/ougaga26-lab/MuseumAIChatbarV1/main/maps/indoor-map.jpg
```

---

## 八、RWD 響應式設計

| 裝置 | 行為 |
|---|---|
| 手機（< 600px） | 全版面，抽屜全寬 |
| 平板 / 桌機（≥ 600px） | 抽屜最大寬 480px，水平置中；overlay 隱藏 |

---

## 九、安全設計

- 所有 API Key 儲存於 Cloudflare Worker 環境變數，前端零暴露
- `GEMINI_KEY`、`AZURE_SPEECH_KEY` 均在 Worker 端注入
- 前端只與 Worker URL 通訊

---

## 十、Logo 與圖示

```
https://ougaga26-lab.github.io/MuseumAIChatbarV1/logo.png
```

---

*規格書版本：V12 / 最後更新：2026/03/25*
