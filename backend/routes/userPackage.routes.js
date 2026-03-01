// backend/routes/userPackage.routes.js

import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import UserPackageController from "../controllers/userPackage.controller.js";

const router = express.Router();
const controller = new UserPackageController();

// ROUTE ĐỂ LẤY CREDIT MÀ FRONTEND ĐANG GỌI
router.get("/my-active", authenticate, controller.getMyActivePackage);

// ROUTE ĐỂ MUA GÓI
router.post("/purchase", authenticate, controller.purchasePackage);

export default router;