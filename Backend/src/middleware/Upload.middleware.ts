import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, _file) => {
    return {
      folder: "shopnow-products",
      allowed_formats: ["jpeg", "jpg", "png", "webp"],
    };
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});