import { clearAllCache, clearCacheKey } from "../middleware/cacheMiddleware.js";
import ListingModel from "../models/ListingModel.js";

export default class ListingService {
  invalidateCache() {
    clearCacheKey("listings");
  }

  /**
   * Lấy danh sách tin đăng (Công khai - Đã duyệt)
   * Kết hợp bộ lọc nâng cao từ HEAD và Populate từ nhánh Than
   */
  async getAll(query) {
    const {
      page = 1,
      limit = 10,
      keyword,
      type,
      propertyType,
      price, // Từ HEAD
      minPrice,
      maxPrice,
      city
    } = query;

    const filter = { status: "APPROVED" };

    // 🔎 SEARCH (Kết hợp cả hai bên)
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { "location.city": { $regex: keyword, $options: "i" } },
        { "location.address": { $regex: keyword, $options: "i" } },
      ];
    }

    // 🏷 Lọc theo loại hình
    if (type && type !== "all") filter.type = type;
    if (propertyType && propertyType !== "all") filter.propertyType = propertyType;
    if (city) filter["location.city"] = { $regex: city, $options: "i" };

    // 💰 Bộ lọc giá từ HEAD (under5, 5to10...)
    if (price) {
      if (price === "under5") {
        filter.price = { $lt: 5000000000 };
      } else if (price === "5to10") {
        filter.price = { $gte: 5000000000, $lte: 10000000000 };
      } else if (price === "above10") {
        filter.price = { $gt: 10000000000 };
      }
    }

    // 💰 Giá dạng range min/max
    if (minPrice || maxPrice) {
      filter.price = filter.price || {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const listings = await ListingModel.find(filter)
      .populate('user', 'name email phone avatar') // Giữ lại của Than để hiện thông tin người đăng
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await ListingModel.countDocuments(filter);

    return {
      listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // --- CÁC HÀM CRUD DƯỚI ĐÂY GIỮ NGUYÊN TỪ NHÁNH THAN ---

  async getById(id) {
    return await ListingModel.findById(id).populate('user', 'name email avatar phone').lean();
  }

  async getMyListings(userId, query) {
    const { page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const listings = await ListingModel.find({ user: userId })
      .populate('user', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await ListingModel.countDocuments({ user: userId });

    return {
      listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async create(userId, data) {
    const UserPackage = await import('../models/UserPackageModel.js').then(m => m.default);
    
    // Kiểm tra package của user
    const activePackage = await UserPackage.findOne({ 
      user: userId, 
      status: 'ACTIVE',
      endDate: { $gte: new Date() }
    });

    if (!activePackage || activePackage.remainingPosts <= 0) {
      throw new Error("OUT_OF_POSTS:Bạn đã hết lượt đăng tin. Vui lòng mua thêm gói.");
    }

    // Giảm số lượng bài đăng còn lại
    activePackage.remainingPosts -= 1;
    activePackage.postsToday += 1;
    activePackage.lastPostDate = new Date();
    
    // Lưu thay đổi vào DB
    await activePackage.save();

    const listing = await ListingModel.create({
      user: userId,
      ...data, // 'images' nằm trong data này (là mảng URL sau khi upload thành công)
      location: {
        address: data.address,
        city: data.city,
        district: data.district,
        ward: data.ward,
        coordinates: data.coordinates || [0, 0]
      },
      status: "APPROVED",
    });
    
    this.invalidateCache();
    return listing;
  }

  async update(listingId, userId, data) {
    const listing = await ListingModel.findOne({ _id: listingId, user: userId });
    if (!listing) throw new Error("Không tìm thấy bài đăng hoặc bạn không có quyền");

    const fieldsToUpdate = [
      "title", "description", "type", "propertyType", 
      "price", "area", "bedrooms", "bathrooms", "images"
    ];

    fieldsToUpdate.forEach((field) => {
      if (data[field] !== undefined) listing[field] = data[field];
    });

    if (data.address || data.city) {
      listing.location = {
        ...listing.location,
        address: data.address || listing.location.address,
        city: data.city || listing.location.city,
        district: data.district || listing.location.district,
        ward: data.ward || listing.location.ward,
      };
    }

    // Preserve the original status or default to APPROVED depending on logic
    // But setting it to APPROVED for consistency if it was strictly hardcoded
    listing.status = "APPROVED";
    await listing.save();
    this.invalidateCache();
    return listing;
  }

  async delete(listingId, userId) {
    const result = await ListingModel.findOneAndDelete({ _id: listingId, user: userId });
    if (!result) throw new Error("Xóa thất bại: Bài đăng không tồn tại");
    this.invalidateCache();
    return result;
  }
}