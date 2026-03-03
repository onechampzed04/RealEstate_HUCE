import PaymentService from "../service/payment.service.js";
import asyncHandler from "express-async-handler";

export default class PaymentController {
  constructor() {
    this.paymentService = new PaymentService();
  }

  createPaymentLink = asyncHandler(async (req, res) => {
    const { packageId } = req.body;
    if (!packageId) {
      res.status(400);
      throw new Error("Vui lòng cung cấp packageId");
    }
    const userId = req.user.id; 

    const paymentLinkData = await this.paymentService.createPaymentLink(
      userId,
      packageId,
    );
    
    res.json({
      success: true,
      message: "Payment link created successfully",
      data: paymentLinkData,
    });
  });

  checkOrderStatus = asyncHandler(async (req, res) => {
    const { orderCode } = req.params;
    const result = await this.paymentService.checkPaymentStatus(Number(orderCode));
    
    res.json({
      success: true,
      data: result
    });
  });
}