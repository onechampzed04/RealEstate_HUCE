import asyncHandler from "express-async-handler";
import ListingService from "../service/listing.service.js";

export const getAllListings = asyncHandler(async (req, res) => {
  const listingService = new ListingService();
  const result = await listingService.getAll(req.query);

  console.log("cache hỏng, lấy dữ liệu mới từ database");

  res.json({
    success: true,
    message: "Lấy danh sách bất động sản thành công",
    data: result,
  });
});
