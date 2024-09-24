import { Server } from "socket.io";

/**
 * socket.io 和 ws 区别：
 * socket.io 和 ws 区别类似于后端中axios和http关系、前端中axios和ajax关系
 * 像我们之前编写的 ws 案例中，需要手动的处理 buffer 数据的转换、遍历多个客户端才能发送消息，而 socket.io 可以自动处理这些细节
 * socket.io 是基于 WebSocket 和其他技术封装而成，能够实现更高级的功能， 比如事件驱动和自动重连。它会在连接时进行一些额外的 HTTP 请求（例如用于握手），这些请求可能会受到跨域策略的影响。因此使用socket.io时需要处理跨院
 * 总而言之使用socket.io是目前即时通信技术的主流方案
 */

// 创建 Socket.IO 服务器，并在指定端口上监听，注意：需要解决跨域问题
const io = new Server(4002, {
  cors: {
    origin: "*", // 允许所有来源
    methods: ["GET", "POST"], // 允许的请求方法
  },
});

// 当有客户端连接时触发
io.on("connection", (socket) => {
  console.log("有新客户端连接!");

  // 监听客户端发送的事件和数据
  socket.on("chatMessage", (data) => {
    console.log("收到消息:", data);

    // 向所有已连接的客户端广播事件和数据
    io.emit("chatMessage", data); // 广播消息给所有客户端
  });

  // 当客户端断开连接时触发
  socket.on("disconnect", () => {
    console.log("客户端已断开连接");
  });
});

console.log("Socket.IO 服务器正在运行，地址: http://localhost:4002");
