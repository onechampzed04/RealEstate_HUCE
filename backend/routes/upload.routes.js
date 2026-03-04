import express from "express";
import upload from "../middleware/upload.middleware.js";
import { uploadImages } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/", upload.array("images", 5), uploadImages);

export default router;
