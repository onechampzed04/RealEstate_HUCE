// backend/service/userPackage.service.js

import UserPackage from "../models/UserPackageModel.js";
import Package from "../models/PackageModel.js";
import mongoose from "mongoose";

export default class UserPackageService {
  async getActivePackageByUserId(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }
    const userPackage = await UserPackage.findOne({
      user: userId,
      status: "ACTIVE",
    }).populate('package'); // Thêm .populate để lấy thông tin chi tiết của gói
    return userPackage;
  }
  
  async purchasePackage(userId, packageId) {
    if (!userId || !packageId) {
      throw new Error("Missing userId or packageId");
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const pkg = await Package.findById(packageId).session(session);
      if (!pkg || !pkg.isActive) {
        throw new Error("Package not found or is inactive");
      }

      // === THAY ĐỔI QUAN TRỌNG: XÓA GÓI CŨ THAY VÌ CẬP NHẬT ===
      // Thay thế findOneAndUpdate bằng findOneAndDelete
      await UserPackage.findOneAndDelete(
        { user: userId, status: "ACTIVE" },
        { session }
      );
      // =======================================================

      // Tạo gói mới
      const startDate = new Date();
      const endDate = new Date(
        startDate.getTime() + pkg.durationDays * 24 * 60 * 60 * 1000,
      );

      const newUserPackage = new UserPackage({
        user: userId,
        package: packageId,
        startDate,
        endDate,
        remainingPosts: pkg.maxPostsPerDay,
        postsToday: 0, 
        status: 'ACTIVE'
      });

      await newUserPackage.save({ session });
      
      await session.commitTransaction();
      return newUserPackage;

    } catch (error) {
      await session.abortTransaction();
      console.error("Lỗi trong quá trình purchasePackage:", error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async togglePackageStatus(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid UserPackage ID");
    }
    const userPackage = await UserPackage.findById(id);
    if (!userPackage) {
      throw new Error("UserPackage not found");
    }

    if (userPackage.status === "ACTIVE") {
      userPackage.status = "PAUSED";
    } else if (userPackage.status === "PAUSED") {
      userPackage.status = "ACTIVE";
    } else {
       throw new Error(`Cannot toggle package with status: ${userPackage.status}`);
    }

    await userPackage.save();
    return userPackage;
  }

  async updateUserPackage(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid UserPackage ID");
    }
    
    const allowedFields = ["endDate", "remainingPosts", "status"];
    const updatePayload = {};
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        updatePayload[key] = updateData[key];
      }
    }

    const updatedPackage = await UserPackage.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      throw new Error("UserPackage not found");
    }
   
    return updatedPackage;
  }

   /**
   * Cập nhật trạng thái hàng loạt khi Admin Khóa/Mở gói cước gốc
   * @param {string} packageId - ID của gói cước gốc (Package)
   * @param {boolean} isLocking - true nếu là khóa gói, false nếu là mở gói
   */
  // backend/service/userPackage.service.js
async toggleAllByPackageId(packageId, isLocking) {
    const now = new Date();
    
    // Logic: Nếu Admin Khóa gói (isLocking = true) 
    // -> Tìm tất cả thằng đang ACTIVE và còn hạn -> chuyển thành PAUSED
    if (isLocking) {
        return await UserPackage.updateMany(
            {
                package: packageId,
                status: "ACTIVE",
                endDate: { $gt: now }
            },
            { $set: { status: "PAUSED" } }
        );
    } 
    // Nếu Admin Mở gói (isLocking = false)
    // -> Tìm tất cả thằng đang bị PAUSED (do bị khóa trước đó) -> chuyển lại thành ACTIVE
    else {
        return await UserPackage.updateMany(
            {
                package: packageId,
                status: "PAUSED",
                endDate: { $gt: now }
            },
            { $set: { status: "ACTIVE" } }
        );
    }
}
  
}