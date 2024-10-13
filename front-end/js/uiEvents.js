export const initUIEvents = (socket) => {
  // 监听进入聊天室按钮的点击
  $(".login-btn").on("click", () => {
    const usernameVal = $(".username-input").val().trim();
    localStorage.setItem("username", usernameVal);
    if (usernameVal) {
      socket.emit("join", { username: usernameVal });
    }
  });

  // 监听发送消息按钮的点击
  $("#form").on("submit", (e) => {
    e.preventDefault();
    const messageVal = $(".message-input").val().trim();
    if (messageVal) {
      socket.emit("chatMessage", { message: messageVal });
      $(".message-input").val("");
    }
  });

  let typingTimer; // 用于存储定时器的变量
  const typingInterval = 1000; // 假设用户停止输入后 1 秒后广播停止输入状态
  // 监听用户正在输入
  $(".message-input").on("input", () => {
    clearTimeout(typingTimer);
    socket.emit("typing");
    typingTimer = setTimeout(() => {
      socket.emit("stop typing"); // 向其他客户端广播停止输入
    }, typingInterval);
  });
};
