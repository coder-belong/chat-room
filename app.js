import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import { addUser, sendMessage, typing, stopTyping, removeUser } from "./socketHandlers.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let chatUserList = [];

io.on("connection", (socket) => {
  const context = { socket, io, chatUserList };

  socket.on("join", (data) => addUser({ ...context, data }));
  socket.on("chatMessage", (data) => sendMessage({ ...context, data }));
  socket.on("disconnect", () => removeUser(context));

  // socket.on("typing", () => typing(context));
  // socket.on("stop typing", () => stopTyping(context));
});

// 启动服务器
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
