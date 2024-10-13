import { initSocketEvents } from "./socketEvents.js";
import { initUIEvents } from "./uiEvents.js";

// 创建 ws 连接
const socket = io("http://localhost:3000");

// 自动聚焦用户名输入框
$(".username-input").focus();

initSocketEvents(socket);
initUIEvents(socket);

const initFileList = async () => {
  const res = await axios.get("http://localhost:3000/files");
  const fileList = res.data;
  let element = "";
  for (const item of fileList) {
    element += `<a href="${item.filename}" class="item" download="${item.originalname}">${item.originalname}</a>`;
  }
  $(".file-list").html(element);
};

initFileList();

// 监听上传按钮的点击
$(".upload-btn").on("click", () => {
  $("#file").click(); // 触发文件选择框
});

// 监听文件输入的变化
$("#file").on("change", (event) => {
  const file = $("#file")[0].files[0]; // 获取用户选择的文件
  const formData = new FormData(); // 创建 FormData 对象
  formData.append("file", file); // 将文件添加到 FormData 中

  // 使用 Axios 上传文件
  axios
    .post("http://localhost:3000/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // 设置请求头
      },
    })
    .then((response) => {
      console.log("Upload Success:", response.data.message); // 输出成功信息
      initFileList();
    });
});

// 监听共享文件按钮的点击
$(".share-file-btn").on("click", () => {
  $(this).addClass("hidden");
  $(".share-file-wrap").removeClass("hidden");
});

$(".share-file-wrap .close").on("click", () => {
  $(".share-file-wrap").addClass("hidden");
  $(".share-file-btn").removeClass("hidden");
});

socket.on("file uploaded", () => {
  initFileList();
});
