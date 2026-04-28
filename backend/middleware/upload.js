// middleware/upload.js
import multer from "multer";

const storage = multer.memoryStorage();
export const uploadSingle = (fieldName = "profilePhoto") =>
  multer({ storage }).single(fieldName);
