import { Server } from "socket.io";

// 创建 Socket.IO
const io = new Server(4003, {
  // 心跳机制：Socket.IO 的心跳机制是一种用于保持客户端和服务器之间的连接活跃的机制，因为客户端长时间不发消息服务端默认是不知道的，所以需要心跳机制来保持连接
  pingInterval: 25000, // 定义了服务器向客户端发送心跳包的频率，每 25 秒发送一次心跳
  pingTimeout: 60000, // 如果 60 秒未收到心跳则断开连接
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/**
 * socket描述：
 * socket：是一个对象，它代表了与客户端的连接。当客户端连接到服务器时，服务器会为每个连接创建一个 socket 对象
 * socket.id 是一个唯一标识符，它是由服务器为每个连入的客户端生成的。这个标识符在整个通信过程中保持不变，用于区分不同的客户端连接。他的值大概如下：FOafKcvDm3K9jfieAAAB
 * 客户端的 socket.id 和服务端的 socket.id 是相同的。每个连接都会生成一个唯一的 socket.id，并在客户端和服务器之间保持一致。你可以在客户端通过 socket.id 访问它，并在服务器上使用 socket.id 来识别和管理特定的连接。
 */

io.on("connection", (socket) => {
  console.log(socket.id);

  // 监听客户端的 join 事件 --- 用户进入聊天室
  socket.on("join", (username) => {
    // 将用户名存储在当前连接的 socket 对象上
    socket.username = username;
    // 发送 userJoined 事件给所有客户端，并携带用户名信息
    io.emit("userJoined", username);
  });

  // 监听客户端发送的 chatMessage 事件 --- 用户发送消息
  socket.on("chatMessage", (message) => {
    // 携带响应数据数据发送 chatMessage 事件给所有客户端
    io.emit("chatMessage", {
      socketId: socket.id,
      username: socket.username,
      text: message,
      time: new Date().toLocaleTimeString(),
    });
  });

  // 监听客户端的 disconnect 事件 --- 用户离开聊天室
  socket.on("disconnect", () => {
    io.emit("userLeft", socket.username);
    delete socket.username;
  });
});

console.log("Socket.IO 服务器正在运行，地址: http://localhost:4003");
