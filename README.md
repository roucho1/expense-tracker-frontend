# expense-tracker-frontend

使用 Next.js + FastAPI 建立的全端記帳專案，支援收支管理、圖表分析與深淺色模式，並支援 RWD 手機版面。

## 功能介紹

- 首頁為記帳資料的週期統計、圓餅圖表/支出明細列表、近期記帳紀錄、快速新增記帳按鈕
- 記帳頁為所有的記帳紀錄列表以及新增/編輯/刪除功能，記帳列表有收支類型、分類類型、日期三種篩選，支援匯出 CSV
- 分析頁為過往所有記帳紀錄的統計、圖表(長條圖/折線圖/圓餅圖)、支出明細列表
- 設定頁為使用者的註冊資料、修改密碼、顯示色系切換功能，以及記帳資料所需要的分類類型的列表/新增/刪除/修改

## 技術棧

- Next.js
- Typescript
- Tailwind CSS
- Recharts（圖表）
- Zustand（登入狀態管理）
- shadcn/ui（Dialog、AlertDialog、Toast）
- next-themes（深淺色模式切換）
- axios（API 請求）

## 架構說明

- 前端：Next.js，部署於 Vercel
- 後端：FastAPI，部署於 Render
- 資料庫：PostgreSQL，由 Render 託管
- 前後端透過 REST API 溝通，JWT 進行身份驗證

## 本機開發

### clone專案

```bash
git clone https://github.com/roucho1/expense-tracker-frontend.git
cd expense-tracker-frontend
```

### 安裝套件

```bash
npm install
```

### 設定環境變數.env.local

```bash
cp .env.example .env.local
```

編輯 .env.local 填入以下變數

- `NEXT_PUBLIC_API_URL`：FastAPI 後端的 domain

### 啟動伺服器

```bash
npm run dev
```

## 頁面路由

| 路徑          | 說明 |
| ------------- | ---- |
| /             | 首頁 |
| /register     | 註冊 |
| /login        | 登入 |
| /transactions | 記帳 |
| /analytics    | 分析 |
| /settings     | 設定 |

## 線上DEMO

線上DEMO網址：https://expense-tracker-frontend-omega-ruddy.vercel.app/

測試帳號：test123@test.com  
測試密碼：test12345

### 桌面版(1920\*1080)淺色模式

![登入頁](https://github.com/user-attachments/assets/2b878ded-c03a-458c-8f27-bd78867713cb)
![首頁](https://github.com/user-attachments/assets/a80d7b73-290f-4f5f-ac6e-a4dc7770ead0)
![記帳](https://github.com/user-attachments/assets/fa97473c-c7a6-40c2-945d-1e06f0f69e7b)
![分析](https://github.com/user-attachments/assets/77bb70dd-2ce3-4ff2-b091-605d510cf1d7)
![設定](https://github.com/user-attachments/assets/cfd3b290-488f-49e2-9ce1-5814eec452f3)

### 桌面版(1920\*1080)深色模式

![首頁](https://github.com/user-attachments/assets/524245f4-3e19-4353-88ea-2de96c422531)
![記帳](https://github.com/user-attachments/assets/27af92ba-3cc5-4ee7-9cb5-e37cf7490b21)

### 手機版淺色模式

![首頁/記帳/分析](https://github.com/user-attachments/assets/70bac232-27c6-455e-8416-8d5eb7e112a6)
