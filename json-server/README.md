# 前言
因為範例為前端靜態網頁，需要後端的資料配合互動，所以編寫的配合這個範例的後端api運作。

# 安裝 JSON Server
使用 NPM 安裝 JSON Server 套件並且安裝在全域環境中。
``` bash
npm install -g json-server
```

# 啟動json-server
``` bash
C:\Users\user\vueapp>json-server json-server/db.json
```
# 使用限制
因為是靜態的資料，所以沒有動態分頁的效果，但對於範例中大部分的操作都可以work。
