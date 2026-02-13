// backend/src/controllers/uploadController.js

import cloudinary from "../services/cloudinary.js";
import fs from "fs";
import path from "path";

export async function uploadImage(req, res) {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ error: "Images required" });
    }

    // group counters per barcode
    const counters = {};

    const uploads = await Promise.all(
      req.files.map(async (file) => {
        // filename WITHOUT extension
        const baseName = path.parse(file.originalname).name;

        counters[baseName] = (counters[baseName] || 0) + 1;

        const publicId = `${baseName}-${counters[baseName]}`;

        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
          public_id: publicId,
          overwrite: true,
        });

        fs.unlink(file.path, () => {});

        return result.secure_url;
      })
    );

    return res.json({ urls: uploads });
  } catch (err) {
    return res.status(500).json({
      error: err.message || "Upload failed",
    });
  }
}
