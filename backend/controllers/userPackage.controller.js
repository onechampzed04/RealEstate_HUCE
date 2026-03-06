import UserPackageService from "../service/userPackage.service.js"; // Chỉ import 1 lần
import asyncHandler from "express-async-handler";

// Sử dụng cấu trúc class để quản lý các hàm
export default class UserPackageController {
  constructor() {
    this.userPackageService = new UserPackageService();
  }

  // Hàm để xử lý request lấy credit
  getMyActivePackage = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const activePackage = await this.userPackageService.getActivePackageByUserId(userId);
    
    res.json({
        success: true,
        message: "Lấy gói đang hoạt động thành công.",
        data: activePackage
    });
  });

  // Hàm để xử lý request mua gói (nếu bạn muốn gọi trực tiếp)
  purchasePackage = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { packageId } = req.body;

    const userPackage = await this.userPackageService.purchasePackage(userId, packageId);
    
    res.status(201).json({
      success: true,
      message: "Package purchased successfully",
      data: userPackage,
    });
  });

  togglePackageStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userPackage = await this.userPackageService.togglePackageStatus(id);
    
    res.json({
      success: true,
      message: "Toggled user package status successfully",
      data: userPackage,
    });
  });

  updateUserPackage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userPackage = await this.userPackageService.updateUserPackage(id, req.body);
    
    res.json({
      success: true,
      message: "Updated user package successfully",
      data: userPackage,
    });
  });
}