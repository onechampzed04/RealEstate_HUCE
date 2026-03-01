import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import PaymentController from "../controllers/payment.controller.js";

const router = express.Router();
const controller = new PaymentController();

router.post("/create-link", authenticate, controller.createPaymentLink);
router.get("/status/:orderCode", authenticate, controller.checkOrderStatus);

export default router;