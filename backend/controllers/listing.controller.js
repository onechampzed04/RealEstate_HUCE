import asyncHandler from "express-async-handler";
import ListingService from "../service/listing.service.js";
import Listing from "../models/ListingModel.js";

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

export const getNearbyListings = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 3000 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: "Thiếu lat hoặc lng",
    });
  }

  const listings = await Listing.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        distanceField: "distance",
        maxDistance: parseInt(radius),
        spherical: true,
      },
    },
    {
      $match: { status: "APPROVED" },
    },
  ]);

  res.json({
    success: true,
    count: listings.length,
    data: listings,
  });
});