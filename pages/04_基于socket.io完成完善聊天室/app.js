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

const users = {};

io.on("connection", (socket) => {
  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("userJoined", username);
  });

  socket.on("message", (message) => {
    io.emit("message", {
      user: users[socket.id],
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
