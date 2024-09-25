const socket = io("http://localhost:4003");

const a = "111";

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
socket.on("userJoined", (username) => {
  const messageElement = $("<div></div>").text(`${username} 加入了聊天室`).addClass("log");
  $(".chat-list-content").append(messageElement);
});

// 监听服务端发送的 userLeft 事件
socket.on("userLeft", (username) => {
  const messageElement = $("<div></div>").text(`${username} 离开了聊天室`).addClass("log");
  $(".chat-list-content").append(messageElement);
});

// 监听服务端发送的 message 事件
socket.on("chatMessage", (data) => {
  const chatListContentElement = $("<div></div>")
    .addClass("message-item")
    .addClass(socket.id === data.socketId ? "my-message" : "other-message").append(`
<div class="user-info">
  <img src="./img/avatar01.png" alt="">
  <div class="username">${data.username}</div>
  <div class="time">${data.time}</div>
</div>
<span class="message-info">${data.text}</span>
`);
  $(".chat-list-content").append(messageElement);
  $(".chat-list-content").scrollTop($(".chat-list-content")[0].scrollHeight);
});
