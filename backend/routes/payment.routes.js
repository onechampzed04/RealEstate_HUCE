import express from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import PaymentController from "../controllers/payment.controller.js";

const router = express.Router();
const controller = new PaymentController();

router.post("/create-link", authenticate, controller.createPaymentLink);
router.get("/status/:orderCode", authenticate, controller.checkOrderStatus);
router.get("/revenue-stats", authenticate, isAdmin, controller.getRevenueStats);
router.get("/recent", authenticate, isAdmin, controller.getRecentTransactions);

export default router;