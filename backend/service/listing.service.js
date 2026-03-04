import ListingModel from "../models/ListingModel.js";
import { clearCacheKey } from "../middleware/cacheMiddleware.js";

export default class ListingService {
  // Hàm xóa cache khi dữ liệu thay đổi
  invalidateCache() {
    clearCacheKey("listings");
  }

  /**
   * Lấy danh sách tin đăng (Công khai - Đã duyệt)
   */
  async getAll(query) {
    const {
      page = 1,
      limit = 10,
      keyword,
      type,
      propertyType,
      minPrice,
      maxPrice,
      city
    } = query;

    const filter = { status: "APPROVED" };

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { "location.address": { $regex: keyword, $options: "i" } },
      ];
    }

    if (type && type !== "all") filter.type = type;
    if (propertyType && propertyType !== "all") filter.propertyType = propertyType;
    if (city) filter["location.city"] = { $regex: city, $options: "i" };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const listings = await ListingModel.find(filter)
      .populate('user', 'name email phone avatar')
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

  async getById(id) {
    const listing = await ListingModel.findById(id).populate('user', 'name email avatar phone').lean();
    return listing;
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

  /**
   * Tạo bài đăng mới
   */
  async create(userId, data) {
    const listing = await ListingModel.create({
      user: userId,
      title: data.title,
      description: data.description,
      type: data.type,
      propertyType: data.propertyType,
      price: data.price,
      area: data.area,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      images: data.images || [],
      location: {
        address: data.address,
        city: data.city,
        district: data.district,
        ward: data.ward,
        coordinates: data.coordinates || [0, 0] // [lng, lat]
      },
      status: "PENDING", // Mặc định chờ duyệt
    });
    
    this.invalidateCache();
    return listing;
  }

  /**
   * Cập nhật bài đăng (Chỉ chủ sở hữu)
   */
  async update(listingId, userId, data) {
    const listing = await ListingModel.findOne({ _id: listingId, user: userId });
    
    if (!listing) {
      throw new Error("Không tìm thấy bài đăng hoặc bạn không có quyền");
    }

    const fieldsToUpdate = [
      "title", "description", "type", "propertyType", 
      "price", "area", "bedrooms", "bathrooms", "images"
    ];

    fieldsToUpdate.forEach((field) => {
      if (data[field] !== undefined) listing[field] = data[field];
    });

    // Cập nhật địa chỉ lồng nhau
    if (data.address || data.city) {
      listing.location = {
        ...listing.location,
        address: data.address || listing.location.address,
        city: data.city || listing.location.city,
        district: data.district || listing.location.district,
        ward: data.ward || listing.location.ward,
      };
    }

    // Quan trọng: Sửa xong thì quay về chờ duyệt
    listing.status = "PENDING";
    
    await listing.save();
    this.invalidateCache();
    return listing;
  }

  /**
   * Xóa bài đăng
   */
  async delete(listingId, userId) {
    const result = await ListingModel.findOneAndDelete({ _id: listingId, user: userId });
    if (!result) throw new Error("Xóa thất bại: Bài đăng không tồn tại");
    
    this.invalidateCache();
    return result;
  }
}