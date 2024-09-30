export const initSocketEvents = (socket) => {
  // 监听服务器发送的 usernameConflict 事件
  socket.on("usernameConflict", (data) => {
    // 显示用户名冲突提示
    alert(data.message);
    // 自动清空用户名输入框，提示用户重新输入
    $(".username-input").val("").focus();
  });

  // 监听服务端发送的 userJoined 事件
  socket.on("userJoined", (data) => {
    // 当用户名已存在时，在改名后点击进入聊天室，会触发 userJoined 事件两次，为什么啊
    // console.log("触发了 userJoined 事件");

    const { username, userNumber } = data;
    console.log(username);
    console.log(socket.name);

    // 隐藏登陆页面，显示聊天页面
    $(".login-page").addClass("hidden");
    $(".chat-page").removeClass("hidden");
    // 清空输入框
    $(".username-input").val("");

    const element = $(
      `
      <div class='log'>${username} 加入了聊天室</div>
      <div class="log">当前在线人数 ${userNumber}人</div >
    `,
    );
    $(".message-wrap").append(element);
  });

  // 监听服务端发送的 userLeft 事件
  socket.on("userLeft", (data) => {
    const { username, userNumber } = data;
    const element = $(`
      <div class='log'>${username} 离开了聊天室</div>
      <div class="log">当前在线人数 ${userNumber}人</div >
    `);
    $(".message-wrap").append(element);
  });

  // 监听服务端发送的 message 事件
  socket.on("chatMessage", (data) => {
    const { username, message, time, socketId } = data;
    const element = $(`
    <div class="message-item ${socket.id === socketId ? "my-message" : "other-message"}">
      <div class="user-info">
        <img src="./img/avatar01.png" alt="">
        <div class="username">${username}</div>
        <div class="time">${time}</div>
      </div>
      <span class="message-info">${message}</span>
    </div>
  `);
    $(".message-wrap").append(element);
    $(".message-wrap").scrollTop($(".message-wrap")[0].scrollHeight);
  });

  // 非核心功能
  socket.on("typing", (data) => {
    const { username } = data;

    let findSameUserTyping = false;
    const $messageItems = $(".message-wrap .message-item");

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
      $(".message-wrap").append(element);
      $(".message-wrap").scrollTop($(".message-wrap")[0].scrollHeight);
    }
  });

  socket.on("stop typing", (data) => {
    const { username } = data;
    console.log(username);
    $(".message-wrap .message-item").each(function () {
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
