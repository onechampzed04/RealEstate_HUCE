import asyncHandler from "express-async-handler";
import ListingService from "../service/listing.service.js";

export default class ListingController {
  constructor() {
    this.listingService = new ListingService();
  }

  getAllListings = asyncHandler(async (req, res) => {
    const result = await this.listingService.getAll(req.query);

    console.log("cache hỏng, lấy dữ liệu mới từ database");

    res.json({
      success: true,
      message: "Lấy danh sách bất động sản thành công",
      data: result,
    });
  });
}
