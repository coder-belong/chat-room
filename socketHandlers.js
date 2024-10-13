export const addUser = ({ socket, io, chatUserList, data }) => {
  const { username } = data; // 从 data 中提取 username

  if (chatUserList.includes(username)) {
    socket.emit("usernameConflict", { message: "该用户名已存在，请更换用户名后再加入。" });
    return;
  }
  socket.username = username;
  chatUserList.push(username);
  // 将用户加入一个聊天室房间
  socket.join("chatRoom");
  // 向 charRoom 房间的客户端发送 userJoined 事件
  io.to("chatRoom").emit("userJoined", { username, userNumber: chatUserList.length, socketId: socket.id });
};

export const sendMessage = ({ socket, io, data }) => {
  const { message } = data;
  io.to("chatRoom").emit("chatMessage", {
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

  io.to("chatRoom").emit("userLeft", {
    username: socket.username,
    userNumber: chatUserList.length,
  });
  delete socket.username;
};

// 非核心功能
export const typing = ({ io, socket }) => {
  io.to("chatRoom").emit("typing", {
    username: socket.username,
    socketId: socket.id,
  });
};

export const stopTyping = ({ io, socket }) => {
  io.to("chatRoom").emit("stop typing", {
    username: socket.username,
  });
};
