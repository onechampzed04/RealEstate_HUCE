// controllers/PackageController.js
import UserPackageService from "../service/userPackage.service.js";
import PackageService from "../service/package.service.js";
import asyncHandler from "express-async-handler";

export default class PackageController {
  constructor() {
    this.packageService = new PackageService();
    this.userPackageService = new UserPackageService();
  }
  getAll = asyncHandler(async (req, res) => {
    const packages = await this.packageService.getAllActivePackages();

    res.json({
      success: true,
      message: "Lấy danh sách các gói đang hoạt động thành công.",
      data: packages,
    });
  });
  
  getAllForAdmin = asyncHandler(async (req, res) => {
    const packages = await this.packageService.getAllPackages();

    res.json({
      success: true,
      message: "Lấy danh sách tất cả gói thành công.",
      data: packages,
    });
  });
  create = asyncHandler(async (req, res) => {
    console.log("Received request to create package with body:", req.body);
    const pkg = await this.packageService.createPackage(req.body);

    res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: pkg,
    });
  });

  update = asyncHandler(async (req, res) => {
    const pkg = await this.packageService.updatePackage(
      req.params.id,
      req.body,
    );

    res.json({
      success: true,
      message: "Package updated successfully",
      data: pkg,
    });
  });

  getById = asyncHandler(async (req, res) => {
    const pkg = await this.packageService.getById(req.params.id);

    res.json({
      success: true,
      message: "Package fetched successfully",
      data: pkg,
    });
  });

  delete = asyncHandler(async (req, res) => {
    const pkg = await this.packageService.deletePackage(req.params.id);

    res.json({
      success: true,
      message: "Package deleted successfully",
      data: pkg,
    });
  });

   // backend/controllers/PackageController.js
toggleStatus = asyncHandler(async (req, res) => {
    // 1. Cập nhật gói gốc trước
    const pkg = await this.packageService.toggleStatus(req.params.id);
    
    // 2. Kiểm tra xem pkg có tồn tại không
    if (!pkg) {
        return res.status(404).json({ success: false, message: "Gói không tồn tại" });
    }

    // 3. Thực hiện cascade (isLocking là true nếu pkg.isActive là false)
    const isLocking = !pkg.isActive;
    
    try {
        const updateResult = await this.userPackageService.toggleAllByPackageId(req.params.id, isLocking);
        console.log(`Updated ${updateResult.modifiedCount} user packages to ${isLocking ? 'PAUSED' : 'ACTIVE'}`);
    } catch (err) {
        console.error("Cascade update failed:", err);
        // Ngay cả khi lỗi cascade, ta vẫn báo pkg đã đổi để FE đồng bộ, 
        // hoặc throw lỗi để Admin biết
    }

    res.json({
        success: true,
        message: pkg.isActive ? "Đã mở khóa gói cước" : "Đã khóa gói cước và tạm dừng người dùng liên quan",
        data: pkg,
    });
});
  
}
