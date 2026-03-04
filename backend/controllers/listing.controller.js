import asyncHandler from "express-async-handler";
import ListingService from "../service/listing.service.js";

const listingService = new ListingService();

export default class ListingController {
  
  // 1. Xem danh sách công khai
  getAllListings = asyncHandler(async (req, res) => {
    const result = await listingService.getAll(req.query);
    res.json({
      success: true,
      data: result,
    });
  });

  getListingById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const listing = await listingService.getById(id);
    if (!listing) {
      res.status(404);
      throw new Error("Không tìm thấy bài đăng");
    }
    res.json({
      success: true,
      data: listing,
    });
  });

  getMyListings = asyncHandler(async (req, res) => {
    const listings = await listingService.getMyListings(req.userId, req.query);
    res.json({
      success: true,
      data: listings,
    });
  });

  // 2. Tạo tin mới
  createListing = asyncHandler(async (req, res) => {
    // req.userId lấy từ middleware xác thực (JWT)
    const listing = await listingService.create(req.userId, req.body);
    res.status(201).json({
      success: true,
      message: "Đăng tin thành công! Vui lòng chờ quản trị viên phê duyệt.",
      data: listing,
    });
  });

  // 3. Cập nhật tin
  updateListing = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedListing = await listingService.update(id, req.userId, req.body);
    res.json({
      success: true,
      message: "Cập nhật thành công. Tin đang được chờ duyệt lại.",
      data: updatedListing,
    });
  });

  // 4. Xóa tin
  deleteListing = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await listingService.delete(id, req.userId);
    res.json({
      success: true,
      message: "Đã xóa bài đăng thành công",
    });
  });
}