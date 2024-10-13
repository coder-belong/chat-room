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
    const { username, userNumber, socketId } = data;
    if (socket.id === socketId) {
      // 隐藏登陆页面，显示聊天页面
      $(".login-page").addClass("hidden");
      $(".chat-page").removeClass("hidden");
      // 清空输入框
      $(".username-input").val("");
    }
    const element = $(`
      <div class='log'>${username} 加入了聊天室</div>
      <div class="log">当前在线人数 ${userNumber}人</div >
    `);
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
    console.log("typing");
    const { username, socketId } = data;

    // 检查当前用户的 "正在输入..." 提示是否已经存在
    const existingTypingMessage = $(`.message-wrap .message-item .username:contains(${username})`)
      .closest(".message-item")
      .find(".typing");
    if (socket.id !== socketId && !existingTypingMessage.length) {
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
    console.log("stop typing");
    const { username } = data;
    // 查找符合条件的元素并添加动画效果
    $(".message-wrap .message-item")
      .filter(function () {
        return $(this).find(".username").text() === username && $(this).find(".typing").length > 0;
      })
      .fadeOut("slow", function () {
        $(this).remove(); // 在动画完成后移除元素
      });
  });
};
