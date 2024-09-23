const WebSocket = require("ws");

// 创建 WebSocket 服务器，监听端口8080
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  console.log("客户端连接成功");

  // 广播消息给所有客户端
  ws.on("message", function incoming(message) {
    console.log("收到消息: %s", message);

    // 向客户端发送回执
    ws.send("服务器收到: " + message);
  });

  // 监听连接关闭
  ws.on("close", function () {
    console.log("客户端已断开连接");
  });

  // 发送欢迎信息
  ws.send("欢迎连接到 WebSocket 服务器");
});
