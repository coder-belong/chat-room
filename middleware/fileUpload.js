import multer from "multer";

// 设置 multer 存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 存储文件的目录
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // 使用时间戳作为文件名
  },
});

// 创建 multer 上传对象
const upload = multer({ storage });

export { upload };
