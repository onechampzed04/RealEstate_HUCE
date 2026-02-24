import express from "express";
import { purchasePackage } from "../controllers/userPackage.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/purchase", authenticate, purchasePackage);

export default router;
