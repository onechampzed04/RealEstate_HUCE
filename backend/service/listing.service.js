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
    const { page = 1, limit = 10, price, type, status, search, area } = query;

    const filter = { status: "APPROVED" };

    if (price) filter.price = price;
    if (area) filter.area = area;
    if (type) filter.type = type;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
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
