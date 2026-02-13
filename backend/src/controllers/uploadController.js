// backend/src/controllers/uploadController.js

import cloudinary from "../services/cloudinary.js";
import streamifier from "streamifier";

function uploadToCloudinary(fileBuffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        public_id: filename,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
}

export async function uploadImage(req, res) {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ error: "Images required" });
    }

    const uploads = await Promise.all(
      req.files.map((file, index) => {
        const nameWithoutExt =
          file.originalname.split(".")[0] || `image-${Date.now()}-${index}`;

        return uploadToCloudinary(file.buffer, nameWithoutExt);
      })
    );

    return res.json({
      urls: uploads.map((u) => u.secure_url),
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message || "Upload failed",
    });
  }
}
