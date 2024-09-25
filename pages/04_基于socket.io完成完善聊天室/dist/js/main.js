const socket = io("http://localhost:4003");

$(".username-input").focus();

// 监听进入聊天室按钮的点击
$(".login-btn").on("click", () => {
  // 获取用户名输入框的值
  const usernameVal = $(".username-input").val().trim();
  if (usernameVal) {
    // 向服务器发送 join 事件，并携带用户名信息
    socket.emit("join", usernameVal);
    // 隐藏登陆页面，显示聊天页面
    $(".login-wrap").addClass("hidden");
    $(".chat-wrap").removeClass("hidden");
    // 清空输入框
    $(".username-input").val("");
  }
});

// 监听发送消息按钮的点击
$(".send-btn").on("click", () => {
  const messageVal = $(".message-input").val().trim();
  if (messageVal) {
    // 向服务器发送 chatMessage 事件，并携带消息内容
    socket.emit("chatMessage", messageVal);
    // 清空输入框
    $(".message-input").val("");
  }
});

// 监听服务端发送的 userJoined 事件
socket.on("userJoined", (data) => {
  const { username, userNumber } = data;
  const element = $(
    `
      <div class='log'>${username} 加入了聊天室</div>
      <div class="log">当前在线人数 ${userNumber}人</div >
    `,
  );
  $(".chat-list-content").append(element);
});

// 监听服务端发送的 userLeft 事件
socket.on("userLeft", (data) => {
  const { username, userNumber } = data;
  const element = $(`
      <div class='log'>${username} 离开了聊天室</div>
      <div class="log">当前在线人数 ${userNumber}人</div >
    `);
  $(".chat-list-content").append(element);
});

// 监听服务端发送的 message 事件
socket.on("chatMessage", (data) => {
  const { username, text, time, socketId } = data;
  const element = $(`
    <div class="message-item ${socket.id === socketId ? "my-message" : "other-message"}">
      <div class="user-info">
        <img src="./img/avatar01.png" alt="">
        <div class="username">${username}</div>
        <div class="time">${time}</div>
      </div>
      <span class="message-info">${text}</span>
    </div>
  `);
  $(".chat-list-content").append(element);
  $(".chat-list-content").scrollTop($(".chat-list-content")[0].scrollHeight);
});
