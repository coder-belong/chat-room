export const addUser = ({ socket, io, chatUserList, data }) => {
  const { username } = data; // 从 data 中提取 username

  if (chatUserList.includes(username)) {
    socket.emit("usernameConflict", { message: "该用户名已存在，请更换用户名后再加入。" });
    return;
  }
  socket.username = username;
  chatUserList.push(username);
  io.emit("userJoined", { username, userNumber: chatUserList.length });
};

export const sendMessage = ({ socket, io, data }) => {
  const { message } = data;
  io.emit("chatMessage", {
    socketId: socket.id,
    username: socket.username,
    message,
    time: new Date().toLocaleTimeString(),
  });
};

export const removeUser = ({ socket, io, chatUserList }) => {
  console.log("有客户端断开连接!");
  const index = chatUserList.indexOf(socket.username);
  if (index !== -1) {
    chatUserList.splice(index, 1);
  }

  io.emit("userLeft", {
    username: socket.username,
    userNumber: chatUserList.length,
  });
  delete socket.username;
};

// 非核心功能
export const typing = ({ socket }) => {
  socket.broadcast.emit("typing", {
    username: socket.username,
    socketId: socket.id,
  });
};

export const stopTyping = ({ socket }) => {
  socket.broadcast.emit("stop typing", {
    username: socket.username,
  });
};
