// === SỬA LẠI IMPORT CHO ĐÚNG VỚI PAYOS v1.x ===
// Bỏ cặp dấu ngoặc nhọn {} đi
import PayOS from "@payos/node";

import Package from "../models/PackageModel.js";
import Payment from "../models/PaymentModel.js";
import UserPackageService from "./userPackage.service.js";

// Khởi tạo PayOS
const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY,
);

const userPackageService = new UserPackageService();

export default class PaymentService {
  async createPaymentLink(userId, packageId) {
    const pkg = await Package.findById(packageId);
    if (!pkg) throw new Error("Package not found");

    const orderCode = Date.now();

    const paymentData = {
      orderCode,
      amount: pkg.price,
      description: `Thanh toan goi ${pkg.name}`,
      returnUrl: `http://localhost:3000/payment-success`,
      cancelUrl: `http://localhost:3000/payment-cancelled`,
    };

    await Payment.create({
      user: userId,
      package: packageId,
      orderCode: orderCode,
      amount: pkg.price,
      status: "PENDING",
    });

    const paymentLink = await payos.createPaymentLink(paymentData);
    return paymentLink;
  }

  async checkPaymentStatus(orderCode) {
    try {
      const paymentRecord = await Payment.findOne({ orderCode });
      if (!paymentRecord) throw new Error("Order not found");

      if (paymentRecord.status === 'PAID') {
        return { status: 'PAID' };
      }
      
      const payosTransaction = await payos.getPaymentLinkInformation(orderCode);

      if (payosTransaction.status === 'PAID') {
        if (paymentRecord.status !== 'PAID') {
            paymentRecord.status = 'PAID';
            await paymentRecord.save();
            await userPackageService.purchasePackage(paymentRecord.user, paymentRecord.package);
        }
      }
      
      return { status: payosTransaction.status };

    } catch (error) {
      console.error("Error checking payment status:", error);
      throw new Error("Failed to check payment status");
    }
  }
}