const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });

wss.on("connection", function connection(ws) {
  console.log("A new client connected!");

  ws.on("message", function incoming(data) {
    // 将 Buffer 转换为字符串
    const receivedMessage = data.toString();
    console.log("received:", receivedMessage);

    // 广播消息给所有客户端
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

console.log("WebSocket server is running on ws://localhost:3000");
