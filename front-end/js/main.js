import { initSocketEvents } from "./socketEvents.js";
import { initUIEvents } from "./uiEvents.js";

// 创建 ws 连接
const socket = io("http://localhost:3000");

// 自动聚焦用户名输入框
$(".username-input").focus();

initSocketEvents(socket);
initUIEvents(socket);
