# 🔒 AltaTech 網站安全機制

本網站已實施多層安全保護機制，防止惡意攻擊、內容篡改和未授權訪問。

## 🛡️ 已實施的安全機制

### 1. Content Security Policy (CSP)
**位置**: HTML `<head>` 中的 `<meta>` 標籤  
**功能**: 控制網頁可以載入哪些資源，防止 XSS 攻擊  
**設定**:
- `default-src 'self'` - 預設只允許同源資源
- `script-src 'self' 'unsafe-inline' 'unsafe-eval'` - 腳本來源限制（包含 GTM 支援）
- `style-src 'self' 'unsafe-inline'` - 樣式來源限制
- `img-src 'self' data: https: blob:` - 圖片來源限制（支援動態內容）
- `object-src 'none'` - 禁用 Flash 等插件
- `frame-ancestors 'none'` - 防止被嵌入 iframe
- `child-src https://www.googletagmanager.com` - 允許 GTM 子框架
- `frame-src https://www.googletagmanager.com` - 允許 GTM 嵌入框架

**GTM 特定設定**:
- 允許的 Google 服務域名：
  - `https://www.googletagmanager.com`
  - `https://www.google-analytics.com`
  - `https://tagmanager.google.com`
  - `https://*.googleapis.com`
  - `https://*.gstatic.com`

### 2. 其他安全標頭
```html
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
<meta http-equiv="Permissions-Policy" content="...">
```

### 3. JavaScript 完整性檢查
**位置**: 安全保護腳本中  
**功能**: 
- 定期檢查關鍵 JS 文件是否被篡改
- 偵測可疑的 JavaScript 模式
- 監控腳本注入攻擊

**檢查的可疑模式**:
- `eval()` 函數調用
- `document.write()` 動態寫入
- `innerHTML` 直接賦值
- 外部 HTTP 資源載入
- 動態屬性賦值

### 4. 防盜鏈機制
**功能**: 檢查訪問來源，防止未授權域名使用  
**允許的域名**:
- `localhost` (本地開發)
- `127.0.0.1` (本地開發)
- `yourusername.github.io` (你的 GitHub Pages 域名，需要替換為實際用戶名)

**安全考量**:
- 已移除通用的 `github.io` 設定以提高安全性
- 僅允許特定的 GitHub Pages 網址，防止其他人的 GitHub Pages 網站濫用

### 5. 開發者工具保護
**功能**:
- 檢測開發者工具開啟
- 顯示警告訊息
- 清空控制台內容
- 防止代碼分析

### 6. 反調試保護
**功能**:
- 插入 `debugger` 語句
- 檢測調試器暫停時間
- 自動清理控制台

### 7. 用戶互動保護
**禁用功能**:
- 右鍵選單 (`contextmenu`)
- F12 開發者工具
- Ctrl+Shift+I 檢查元素
- Ctrl+U 檢視原始碼
- Ctrl+S 儲存頁面
- 文字選取功能

### 8. DOM 變化監控
**功能**:
- 使用 `MutationObserver` 監控 DOM 變化
- 自動移除未授權的腳本注入
- 檢查新增節點的合法性

**GTM 例外處理**:
- 允許包含 `gtag`、`dataLayer`、`GTM-` 關鍵字的腳本
- 允許來自 Google 相關域名的腳本
- 保護 GTM 彈窗和追蹤代碼正常運作

### 9. 腳本白名單機制
**實施方式**:
- 所有合法腳本都標記 `data-legitimate="true"`
- 未標記的腳本會被自動移除
- 防止惡意腳本注入

**GTM 特殊處理**:
- GTM 相關腳本不需要 `data-legitimate` 屬性
- 自動識別並允許 Google Tag Manager 腳本
- 支援動態載入的追蹤代碼和彈窗腳本

## ⚙️ 設定說明

### GitHub Pages 部署前準備
1. **更新允許域名**: 將 `yourusername.github.io` 替換為你的實際 GitHub 用戶名
   - 範例：如果用戶名是 `chengsarah`，則改為 `chengsarah.github.io`
   - 位置：四個 HTML 檔案中的 `allowedDomains` 陣列
2. **測試功能**: 確保所有安全機制不會影響正常功能
3. **檢查 CSP**: 根據實際需求調整 Content Security Policy
4. **安全驗證**: 確認移除了通用的 `github.io` 設定以提高安全性

### GTM 整合設定
**Google Tag Manager 整合已完成**:
- 已設定 GTM 容器 ID：`GTM-PRTSFN96`
- CSP 政策已調整為支援 GTM 彈窗和追蹤功能
- 安全監控已豁免 GTM 相關腳本
- 支援透過 GTM 埋入第三方追蹤代碼和彈窗

### 自定義設定
在安全保護腳本中，你可以調整：
- 允許的來源域名
- 可疑模式的正則表達式
- 開發者工具檢測敏感度
- 保護機制的強度
- GTM 例外處理規則

## 🚨 注意事項

### 開發階段
- 開發時可能需要暫時禁用某些保護功能
- 建議在本地測試所有功能正常運作

### 生產環境
- 確保 `allowedDomains` 包含正確的域名（僅你的 GitHub Pages 網址）
- 避免使用通用的 `github.io` 設定，以防止其他人的網站濫用
- 定期檢查是否有新的安全威脅
- 監控瀏覽器控制台的警告訊息
- 確認所有四個 HTML 檔案的安全設定一致

### 相容性
- 現代瀏覽器支援良好
- IE 舊版本可能不支援部分功能
- 移動裝置瀏覽器基本支援

## 🔧 故障排除

### 如果頁面功能異常
1. 檢查瀏覽器控制台是否有 CSP 錯誤
2. 確認所有腳本都有 `data-legitimate` 屬性
3. 驗證 `allowedDomains` 設定是否正確

### 如果保護過於嚴格
- 可以註釋掉特定的保護函數
- 調整 CSP 政策以允許必要的資源
- 修改敏感度設定

## 🛡️ 受保護的頁面

以下所有頁面都已實施完整的安全保護機制：

- ✅ **index.html** - 主頁，完整安全機制
- ✅ **english.html** - 英文頁面，完整安全機制  
- ✅ **privacy.html** - 隱私權政策頁面，完整安全機制
- ✅ **sample.html** - 設計系統示範頁面，完整安全機制

## 📋 安全檢查清單

部署前請確認：
- [ ] CSP 政策已正確設定
- [ ] 所有合法腳本已標記 `data-legitimate`
- [ ] 允許域名清單已更新
- [ ] 所有功能在生產環境中正常運作
- [ ] 安全警告訊息顯示正確
- [ ] 無不必要的控制台錯誤

**GTM 整合檢查**:
- [ ] GTM 容器 ID 設定正確 (`GTM-PRTSFN96`)
- [ ] GTM 彈窗能夠正常顯示
- [ ] 第三方追蹤代碼正常載入
- [ ] 沒有 CSP 阻擋 GTM 相關資源
- [ ] 動態腳本注入功能正常

## 🆘 緊急停用

如果安全機制影響正常使用，可以：
1. 註釋掉安全保護腳本的調用
2. 移除或修改 CSP meta 標籤
3. 暫時允許所有來源域名

---

**⚠️ 重要提醒**: 這些安全機制提供基礎保護，但不能完全防範所有攻擊。建議配合服務器端安全措施使用。