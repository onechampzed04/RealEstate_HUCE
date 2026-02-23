import UserPackage from "../models/UserPackageModel.js";
import Package from "../models/PackageModel.js";
import mongoose from "mongoose";

export default class UserPackageService {
  async purchasePackage(userId, packageId) {
    // Kiểm tra gói có tồn tại không

    if (!userId || !packageId) {
      throw new Error("Missing userId or packageId");
    }
    // const session = await mongoose.startSession();
    // session.startTransaction();

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
}
