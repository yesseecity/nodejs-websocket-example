# Websocket 範例

### Server 端解說
start-socket-server.js
先透過'socket.io'

先設定SQL DB 的資訊，再建立 socket server

當Socket有Client端連上後
透過 './server/socket-control.js' 模組進行 DB 欄未監控
當值改變後 透過socket 跟client端說有改變(於'./server/socket-control.js' 39~57行）。

同時監聽client 是否透過socket 發出 'db change age'事件並回寫到DBㄋ （於 socket-control.js）


### Client 端解說
先變更年齡，再監聽DB是否有再變更