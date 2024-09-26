// 创建ws连接
let socket = null;

$(".username-input").focus();

const handleSocketOn = () => {
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

  socket.on("typing", (data) => {
    const { username } = data;

    let findSameUserTyping = false;
    const $messageItems = $(".chat-list-content .message-item");

    $messageItems.each(function () {
      if ($(this).find(".username").text() === username && $(this.find(".typing"))) {
        findSameUserTyping = true;
      }
    });

    if (!findSameUserTyping) {
      const element = $(`
    <div class="message-item other-message}">
      <div class="user-info">
        <img src="./img/avatar01.png" alt="">
        <div class="username">${username}</div>
      </div>
      <span class="typing message-info">正在输入...</span>
    </div>
  `);
      $(".chat-list-content").append(element);
      $(".chat-list-content").scrollTop($(".chat-list-content")[0].scrollHeight);
    }
  });

  socket.on("stop typing", (data) => {
    const { username } = data;
    $(".chat-list-content .message-item").each(function () {
      if ($(this).find(".username").text() === username && $(this.find(".typing"))) {
        // 在这里添加动画效果
        $(this).fadeOut("slow", function () {
          // 在动画完成后移除元素
          $(this).remove();
        });
      }
    });
  });
};

// 监听进入聊天室按钮的点击
$(".login-btn").on("click", () => {
  // 仅当用户点击进入聊天室按钮后，
  socket = io("http://localhost:4003");
  handleSocketOn();
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

let typingTimer; // 用于存储定时器的变量
const typingInterval = 1000; // 假设用户停止输入后 1 秒后广播停止输入状态

$(".message-input").on("input", () => {
  clearTimeout(typingTimer);
  socket.emit("typing");
  typingTimer = setTimeout(() => {
    socket.emit("stop typing"); // 向其他客户端广播停止输入
  }, typingInterval);
});
