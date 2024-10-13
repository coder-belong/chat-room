import fs from "fs";
import path from "path";
import cron from "node-cron";

export const scheduleCleanUploads = (uploadDir) => {
  // 定时任务每天凌晨 00:00 清空 uploads 文件夹
  cron.schedule("0 0 * * *", () => {
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        console.error("读取 uploads 文件夹失败:", err);
        return;
      }

      // 遍历删除所有文件
      for (const file of files) {
        fs.unlink(path.join(uploadDir, file), (err) => {
          if (err) {
            console.error(`删除文件 ${file} 失败:`, err);
          } else {
            console.log(`文件 ${file} 已成功删除`);
          }
        });
      }
    });
  });
};
