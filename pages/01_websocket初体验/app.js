import WebSocket from "ws";

// 创建 WebSocket 服务器，监听端口4000
const wss = new WebSocket.Server({ port: 4000 });

/**
 * 服务端要做的事情
 * 1. 监听客户端的连接
 * 2. 当有客户端消息传来时，处理并响应。
 */
wss.on("connection", (ws) => {
  console.log("客户端连接成功");

  // ws.send(): 发送信息给客户端
  ws.send("欢迎连接到 WebSocket 服务器");

  // ws.on(): 监听客户端发送的消息
  ws.on("message", (data) => {
    // 将接收到的data是 Buffer 数据，需要将其转换为字符串
    const receivedMessage = data.toString();
    console.log("服务端收到消息: ", receivedMessage);
    // 向客户端发送信息
    ws.send(receivedMessage);
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
