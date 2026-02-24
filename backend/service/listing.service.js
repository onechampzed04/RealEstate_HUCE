import { clearAllCache, clearCacheKey } from "../middleware/cacheMiddleware.js";
import ListingModel from "../models/ListingModel.js";

export default class ListingService {
  invalidateCache() {
    clearCacheKey("listings");
  }

  /**
   * Get All Products
   */
  async getAll(query) {
  const {
    page = 1,
    limit = 10,
    keyword,
    type,
    propertyType,
    price,
    minPrice,
    maxPrice,
  } = query;

  const filter = { status: "APPROVED" };

  // 🔎 SEARCH giống property cũ
  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { "location.city": { $regex: keyword, $options: "i" } },
      { "location.address": { $regex: keyword, $options: "i" } },
    ];
  }

  // 🏷 SALE / RENT
  if (type && type !== "all") {
    filter.type = type;
  }

  // 🏠 APARTMENT / HOUSE / LAND / VILLA
  if (propertyType && propertyType !== "all") {
    filter.propertyType = propertyType;
  }

  // 💰 Giá kiểu property cũ
  if (price) {
    if (price === "under5") {
      filter.price = { $lt: 5000000000 };
    } else if (price === "5to10") {
      filter.price = { $gte: 5000000000, $lte: 10000000000 };
    } else if (price === "above10") {
      filter.price = { $gt: 10000000000 };
    }
  }

  // 💰 Giá dạng range nâng cao
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (page - 1) * limit;
  const limitNum = parseInt(limit);

  const listings = await ListingModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = await ListingModel.countDocuments(filter);

  return {
    listings,
    pagination: {
      page: parseInt(page),
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}
}
