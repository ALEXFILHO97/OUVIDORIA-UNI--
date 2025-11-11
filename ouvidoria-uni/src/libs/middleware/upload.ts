import multer from "multer";
import path from "path";
import { v4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (_req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(null, `${v4()}.${extname}`);
  },
});

export const upload = multer({ storage });

const middleware = upload.single("file");

export default middleware;
