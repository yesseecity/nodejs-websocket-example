# Websocket 範例

## 程式解說

### Server 端解說

啟動方式```node start-socket-server.js```
先透過'socket.io'

先設定SQL DB 的資訊，再建立 socket server

當Socket有Client端連上後
透過 './server/socket-control.js' 模組進行 DB 欄未監控
當值改變後 透過socket 跟client端說有改變(於'./server/socket-control.js' 39~57行）。
同時監聽client 是否透過socket 發出 'db change age'事件並回寫到DB （於 socket-control.js）  

### Client 端解說

啟動方式```node client-user.js```
先變更年齡，再監聽DB是否有再變更

## 環境建製

### Node JS
* 先安裝nodeJs, 本範例使用 nodejs v12.16.2
* git clone 本專案後進入專案資料夾 鍵入 npm install


## Docker-compose
```docker-compose up```
