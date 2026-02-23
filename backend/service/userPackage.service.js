import UserPackage from "../models/UserPackageModel.js";
import Package from "../models/PackageModel.js";
import mongoose from "mongoose";

export default class UserPackageService {
  async purchasePackage(userId, packageId) {
    // Kiểm tra gói có tồn tại không

    if (!userId || !packageId) {
      throw new Error("Missing userId or packageId");
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    const existingActive = await UserPackage.findOne({
      user: userId,
      status: "ACTIVE",
    });

    if (existingActive) {
      throw new Error("User already has an active package");
    }
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      const error = new Error("Package not found");
      error.statusCode = 404;
      throw error;
    }

    // Tính toán ngày bắt đầu và kết thúc
    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + pkg.durationDays * 24 * 60 * 60 * 1000,
    );

    // Tạo UserPackage mới
    const userPackage = new UserPackage({
      user: userId,
      package: packageId,
      startDate,
      endDate,
      remainingPosts: pkg.maxTotalPosts,
      postsToday: pkg.maxPostsPerDay,
    });

    await userPackage.save();
    return userPackage;
  }

  async activatePackage(paymentId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const payment = await Payment.findById(paymentId)
        .populate("package")
        .session(session);

      if (!payment) throw new Error("Payment not found");

      payment.status = "SUCCESS";
      await payment.save({ session });

      const userPackage = await UserPackage.findOne({
        payment: payment._id,
      })
        .populate("package")
        .session(session);

      const now = new Date();
      const endDate = new Date();
      endDate.setDate(now.getDate() + userPackage.package.durationDays);

      userPackage.status = "ACTIVE";
      userPackage.startDate = now;
      userPackage.endDate = endDate;

      await userPackage.save({ session });

      await session.commitTransaction();
      session.endSession();

      return userPackage;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
