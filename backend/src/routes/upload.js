// backend/src/routes/upload.js
import express from "express";
import upload from "../middleware/upload.js";
import { uploadImage } from "../controllers/uploadController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/image", adminAuth, upload.array("images", 10), uploadImage);

export default router;
