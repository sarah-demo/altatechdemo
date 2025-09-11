# 🔒 ALTA TECH 網站安全政策與標準

本文件詳細說明 ALTA TECH 網站實施的最新安全標準和防護機制，確保網站抵禦現代網路威脅。

## 🛡️ 核心安全標準

### 1. Content Security Policy (CSP) 2025 標準

我們實施了符合最新 CSP Level 3 標準的安全政策：

```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
    https://cdnjs.cloudflare.com
    https://www.googletagmanager.com
    https://www.google-analytics.com
    https://tagmanager.google.com
    https://*.googleapis.com
    https://*.gstatic.com
    https://*.alta-di.com
    https://front-assets.alta-di.com
    https://front-assets.quickcep.com;
  style-src 'self' 'unsafe-inline'
    https://*.googleapis.com
    https://*.gstatic.com
    https://*.alta-di.com;
  img-src 'self' data: https: blob:;
  font-src 'self' data:
    https://*.googleapis.com
    https://*.gstatic.com
    https://*.alta-di.com;
  connect-src 'self'
    https://www.google-analytics.com
    https://www.googletagmanager.com
    https://tagmanager.google.com
    https://*.googleapis.com
    https://*.alta-di.com
    wss://*.alta-di.com;
  media-src 'self';
  object-src 'none';
  child-src https://www.googletagmanager.com https://*.alta-di.com;
  frame-src https://www.googletagmanager.com https://*.alta-di.com;
  frame-ancestors 'self';
  base-uri 'self';
  form-action 'self';
```

#### CSP 指令詳細說明

| 指令 | 設定值 | 用途 |
|------|--------|------|
| `default-src` | `'self'` | 預設只允許同源資源載入 |
| `script-src` | 多個信任域名 | 控制 JavaScript 腳本來源，支援 GTM、分析和即時聊天 |
| `style-src` | 信任的樣式來源 | 允許內嵌樣式和信任的 CSS 來源 |
| `img-src` | `'self' data: https: blob:` | 支援各種圖片來源格式 |
| `connect-src` | API 和 WebSocket 端點 | 控制 AJAX、WebSocket、EventSource 連線 |
| `frame-src` | 信任的 iframe 來源 | 允許 GTM 和即時聊天 iframe |
| `frame-ancestors` | `'self'` | 防止點擊劫持，只允許同源嵌入 |
| `object-src` | `'none'` | 完全禁用 Flash 等外掛程式 |

### 2. 現代 HTTP 安全標頭

```http
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=(), vibrate=(), fullscreen=(self)
```

#### 安全標頭說明

- **X-Frame-Options**: 防止點擊劫持攻擊
- **X-Content-Type-Options**: 防止 MIME 類型嗅探攻擊
- **Referrer-Policy**: 控制 Referer 標頭資訊洩露
- **Permissions-Policy**: 限制瀏覽器 API 存取權限

### 3. 信任域名管理

#### 已授權的腳本來源

**Google 服務生態系**:
- `*.googleapis.com` - Google API 服務
- `*.gstatic.com` - Google 靜態資源
- `www.googletagmanager.com` - 標籤管理器
- `www.google-analytics.com` - 分析服務
- `tagmanager.google.com` - 標籤服務

**CDN 和第三方服務**:
- `cdnjs.cloudflare.com` - 可信任的 CDN
- `*.alta-di.com` - 公司主要服務域名（通配符）
- `front-assets.alta-di.com` - 前端靜態資源
- `front-assets.quickcep.com` - 即時聊天靜態資源

#### WebSocket 連線授權

- `wss://*.alta-di.com` - 即時聊天 WebSocket 連線

## 📱 即時聊天整合安全

### 允許的聊天平台資源

1. **主要腳本**: `https://achat.alta-di.com/initQuickChat.js`
2. **圖示庫**: `https://front-assets.quickcep.com/library/icon/chat-icon.js`
3. **WebSocket**: `wss://*.alta-di.com` (即時通訊)
4. **iframe**: 聊天視窗和彈出介面

### 聊天安全措施

- ✅ 腳本完整性驗證
- ✅ WebSocket 加密連線 (WSS)
- ✅ 同源政策豁免（受控制）
- ✅ iframe 沙盒保護

## 🌐 部署環境安全

### GitHub Pages 安全配置

**生產環境域名**: `https://sarah-demo.github.io/`

**安全考量**:
- HTTPS 強制加密
- CSP 適配 GitHub Pages 環境
- 跨源資源共享 (CORS) 控制
- 靜態檔案完整性保護

### 本地開發安全

**允許的開發域名**:
- `localhost` (所有埠號)
- `127.0.0.1` (所有埠號)
- `file://` (本地檔案系統，僅開發用)

## 🔍 安全監控與檢測

### 自動化安全檢查

1. **CSP 違規監控**: 即時偵測和記錄 CSP 違規
2. **腳本完整性檢查**: 驗證關鍵 JavaScript 檔案
3. **DOM 變更監控**: `MutationObserver` 防範 XSS 攻擊
4. **網路請求監控**: 檢測異常的外部請求

### 威脅偵測模式

```javascript
const suspiciousPatterns = [
  /eval\s*\(/,                    // eval() 函數調用
  /document\.write\s*\(/,         // document.write() 注入
  /innerHTML\s*=/,                // innerHTML 直接賦值
  /http:\/\/[^\/]/,               // HTTP 非安全連線
  /javascript:/,                  // javascript: 協議
  /<script[^>]*>.*<\/script>/     // 內嵌腳本標籤
];
```

### 反調試保護

- 開發者工具檢測
- 自動清理控制台
- debugger 語句插入
- 時間差異檢測

## 🛠️ 實施狀態

### 受保護的頁面

| 頁面 | CSP | 安全標頭 | 聊天支援 | 狀態 |
|------|-----|----------|----------|------|
| `index.html` | ✅ | ✅ | ✅ | 已部署 |
| `english.html` | ✅ | ✅ | ✅ | 已部署 |
| `privacy.html` | ✅ | ✅ | ✅ | 已部署 |
| `cards.html` | ✅ | ✅ | ✅ | 已部署 |
| `sample.html` | ✅ | ✅ | ✅ | 已部署 |

### 功能驗證檢查清單

**基礎安全**:
- [x] CSP 政策載入無錯誤
- [x] 所有安全標頭正確設置
- [x] HTTPS 強制重定向
- [x] 跨站點腳本 (XSS) 防護

**即時聊天整合**:
- [x] 聊天腳本載入成功
- [x] WebSocket 連線建立
- [x] 聊天視窗正常顯示
- [x] 無 CSP 違規錯誤

**第三方服務**:
- [x] Google Analytics 正常運作
- [x] Google Tag Manager 載入
- [x] CDN 資源載入無阻擋
- [x] 字體和樣式正確顯示

## 📋 合規性標準

### 國際安全標準

- **OWASP Top 10 2021**: 防範最新 Web 應用程式安全風險
- **CSP Level 3**: 實施最新的內容安全政策標準
- **Mozilla Security Guidelines**: 遵循 Mozilla 安全最佳實踐
- **Google Security Standards**: 符合 Google 推薦的 Web 安全標準

### 隱私權保護

- **GDPR 相容**: 歐盟一般資料保護規範
- **CCPA 相容**: 加州消費者隱私法案
- **Cookie Policy**: 明確的 Cookie 使用政策
- **Data Minimization**: 最小資料收集原則

## 🚨 事件回應

### 安全事件分類

**Level 1 - 資訊性**:
- CSP 違規報告
- 開發者工具使用偵測
- 異常使用者行為

**Level 2 - 警告**:
- 可疑腳本注入嘗試
- 未授權域名存取
- 異常網路請求

**Level 3 - 嚴重**:
- 成功的 XSS 攻擊
- 資料洩露事件
- 服務中斷

### 聯絡資訊

**安全團隊**: security@alta-di.com  
**緊急回應**: 24小時內回覆  
**一般諮詢**: 48小時內回覆  

## 🔄 維護與更新

### 定期檢查週期

- **每月**: CSP 違規報告分析
- **每季**: 信任域名清單審查
- **每半年**: 安全政策全面檢討
- **年度**: 第三方安全稽核

### 更新記錄

| 版本 | 日期 | 更新內容 |
|------|------|----------|
| v3.0 | 2025-09 | 新增即時聊天支援、更新 CSP 到 Level 3 標準 |
| v2.1 | 2025-08 | 強化 Permissions Policy、新增 WebSocket 支援 |
| v2.0 | 2025-07 | 實施現代安全標頭、GTM 整合 |
| v1.0 | 2025-06 | 初始 CSP 實施 |

---

## 📖 開發者指南

### 新增信任域名流程

1. 評估域名安全性和必要性
2. 更新所有 HTML 頁面的 CSP 設定
3. 測試功能完整性
4. 部署前安全檢查
5. 監控 CSP 違規報告

### 故障排除

**常見問題**:

**Q**: 新的第三方服務被 CSP 阻擋？  
**A**: 檢查 `script-src` 是否包含該域名，必要時新增到信任清單

**Q**: 即時聊天無法載入？  
**A**: 確認 `*.alta-di.com` 和 `front-assets.quickcep.com` 已加入 CSP

**Q**: WebSocket 連線失敗？  
**A**: 檢查 `connect-src` 是否包含 `wss://*.alta-di.com`

### 最佳實踐

1. **最小權限原則**: 只允許必要的資源來源
2. **定期審查**: 移除不再使用的域名授權
3. **監控優先**: 建立 CSP 違規監控機制
4. **測試驅動**: 每次更新都進行完整功能測試
5. **文檔同步**: 保持安全文檔與實際配置同步

---

*最後更新: 2025年9月*  
*下次檢查: 2025年12月*  
*文檔版本: v3.0*