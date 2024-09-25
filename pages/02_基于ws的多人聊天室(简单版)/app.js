import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 4001 });

// 当有客户端连接时触发
wss.on("connection", (ws) => {
  console.log("有新客户端连接!");

  // 监听客户端发送的消息
  ws.on("message", (data) => {
    // 将接收到的data是 Buffer 数据，需要将其转换为字符串
    const receivedMessage = data.toString();
    console.log("收到消息:", receivedMessage);

    // 向所有已连接的客户端广播消息;
    wss.clients.forEach((client) => {
      // 确保客户端的 WebSocket 连接是打开状态
      if (client.readyState === WebSocket.OPEN) {
        client.send(receivedMessage); // 发送消息给客户端
      }
    });
  });

  /**
   * 当客户端断开连接时触发,客户端断开的原因可能包括：
   * 1. 用户主动关闭浏览器或页面
   * 2. 网络故障导致连接中断
   * 3. 服务器主动关闭连接
   * 4. 服务器超时未收到客户端的消息
   */
  ws.on("close", () => {
    console.log("客户端已断开连接");
    // 服务端可以在这里执行其他处理，例如：
    // 1. 清理与该客户端相关的资源，例如用户状态、聊天记录等
    // 2. 更新在线用户列表
    // 3. 广播消息通知其他客户端某用户已离开
    // 4. 实现重连机制，在连接断开后尝试重新连接。
  });
});

console.log("WebSocket 服务器正在运行，地址: ws://localhost:4001");
