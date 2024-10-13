import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import { addUser, sendMessage, typing, stopTyping, removeUser } from "./handlers/socketHandlers.js";
import { upload } from "./middleware/fileUpload.js";
import cors from "cors";
import path from "path";
import { scheduleCleanUploads } from "./cron/cleanUploads.js"; // 引入定时任务

const app = express();
app.use(cors());
app.use(express.static(path.join(process.cwd(), "front-end")));
app.use(express.static(path.join(process.cwd(), "uploads")));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let chatUserList = [];
let uploadedFiles = []; // 用于存储上传的文件信息

io.on("connection", (socket) => {
  const context = { socket, io, chatUserList };

  socket.on("join", (data) => addUser({ ...context, data }));
  socket.on("chatMessage", (data) => sendMessage({ ...context, data }));
  socket.on("disconnect", () => removeUser(context));

  socket.on("typing", () => typing(context));
  socket.on("stop typing", () => stopTyping(context));
});

// 文件上传路由
app.post("/upload", upload.array("file"), (req, res) => {
  const { files } = req;
  uploadedFiles.push(...files);
  console.log("fileList:", uploadedFiles);
  // 通知所有客户端有新文件上传
  io.emit("file uploaded");
  res.send({ message: "文件上传成功!", files });
});

// 获取文件列表路由
app.get("/files", (req, res) => {
  res.send(uploadedFiles); // 返回文件列表
});

// 启动定时任务，清空 uploads 文件夹
const uploadDir = path.join(process.cwd(), "uploads");
scheduleCleanUploads(uploadDir);

// 启动服务器
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
