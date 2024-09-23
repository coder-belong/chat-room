// server.js
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  console.log("A new client connected!");

  // 广播消息给所有客户端
  ws.on("message", function incoming(message) {
    // 将 Buffer 转换为字符串
    const receivedMessage = message.toString();
    console.log("received:", receivedMessage);

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(receivedMessage);
      }
    });
  });

  ws.on("close", function () {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
