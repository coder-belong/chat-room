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

// 用于存储每个连接的客户端信息，其中键是唯一标识 socket.id，值是客户端的用户名，这样做的目的是为了将连接的客户端和其对应的用户名关联起来。
// 数据格式 users: { FOafKcvDm3K9jfieAAAB: '11', CW42xRoGv78keuXRAAAD: '22' }
const users = {};

io.on("connection", (socket) => {
  // socket：是一个对象，它代表了与客户端的连接。当客户端连接到服务器时，服务器会为每个连接创建一个 socket 对象
  // socket.id 是一个唯一标识符，它是由服务器为每个连入的客户端生成的。这个标识符在整个通信过程中保持不变，用于区分不同的客户端连接。

  // 监听客户端的 join 事件
  socket.on("join", (username) => {
    // 将用户名存储在 users 对象中，键为 socket.id，值为用户名
    users[socket.id] = username;
    console.log("users:", users);
    // 发送 userJoined 事件给所有客户端，并携带用户名信息
    io.emit("userJoined", username);
  });

  // 监听客户端发送的 chatMessage 事件
  socket.on("chatMessage", (message) => {
    // 携带响应数据数据发送 chatMessage 事件给所有客户端
    io.emit("chatMessage", {
      userName: users[socket.id],
      text: message,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      io.emit("userLeft", users[socket.id]);
      delete users[socket.id];
    }
  });
});

console.log("Socket.IO 服务器正在运行，地址: http://localhost:4003");
