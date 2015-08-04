# 八仙傷患名單搜尋

http://koshuang.github.io/wounded_search/

Responsive Web Design with Material Design

## 功能

* 操作
  * 在每個頁面上左右滑動可切換 Tab
* 狀況報告
  * 受傷 / 重傷 / 出院 人數
  * 資料來源
  * 最後修改時間
* 提醒
* 搜尋
  * 可針對全部欄位搜尋
  * 模糊搜尋，例如： 林文君 可找到 林○君
* 傷者資訊列表：
  * 收治單位
    * 縣市 / 醫院 / 電話
  * 個人資料
    * 姓名 / 性別 / 年齡 / 國籍
  * 狀況
    * 即時動態
    * 傷勢
    * 編號 / 檢傷編號

## 使用技術

  * gulp
    * browser-sync
    * gulp-inject: 一加入任何檔案，gulp 會自動把該檔案路徑加到 index.html，方便開發
  * Angular JS
    * ng-infinite-scrolling: 為了增進 Performance，Delay Render 的時機點，在讀取 API 資料後，先 Render 前 40 筆資料，之後再依據 Scroll 做即時 Render
    * angular-material: Material Design
  * Ramda: Functional library like lodash/underscore
  * Fuse: Fussy search library
  * GA tracking

## Contribution

  * npm install gulp -g
  * npm install
  * gulp serve
