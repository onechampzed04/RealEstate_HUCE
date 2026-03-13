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
      title: data.title,
      description: data.description,
      type: data.type,
      propertyType: data.propertyType,
      price: Number(data.price),
      area: Number(data.area),
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      
      // Các trường mới nằm ở cấp cao nhất của Schema
      floors: Number(data.floors) || 1,
      frontage: Number(data.frontage) || 0,
      furnitureStatus: data.furniture_state || 'Khác', 
      
      images: data.images,
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

    // Các trường số cần ép kiểu để AI không bị lỗi
    const numericFields = ["price", "area", "bedrooms", "bathrooms", "floors", "frontage"];

    // 1. Cập nhật các trường cơ bản và trường mới cho AI
    Object.keys(data).forEach(field => {
      if (data[field] !== undefined) {
        if (numericFields.includes(field)) {
          listing[field] = Number(data[field]);
        } else if (field === 'furniture_state') {
          // Map từ furniture_state (frontend) sang furnitureStatus (DB Model)
          listing.furnitureStatus = data[field];
        } else if (!['address', 'city', 'district', 'ward', 'images', 'existingImages', 'latitude', 'longitude'].includes(field)) {
          // Chỉ cập nhật nếu trường đó tồn tại trong Schema
          listing[field] = data[field];
        }
      }
    });

    // 2. Cập nhật Vị trí (Sử dụng trực tiếp biến "data")
    if (data.address || data.city || data.district || data.ward) {
      listing.location = {
        ...listing.location,
        address: data.address || listing.location.address,
        city: data.city || listing.location.city,
        district: data.district || listing.location.district,
        ward: data.ward || listing.location.ward
      };
    }

    // 3. Cập nhật tọa độ (nếu có gửi lên)
    if (data.latitude !== undefined && data.longitude !== undefined) {
      listing.location.coordinates = [Number(data.longitude), Number(data.latitude)];
    }

    // 4. Xử lý Hình ảnh (Đã gộp từ controller gửi qua)
    if (data.images !== undefined) {
      let parsedImages = data.images;
      // Nếu images gửi qua là string (do FormData), hãy parse nó
      try {
        if (typeof data.images === "string") {
          parsedImages = JSON.parse(data.images);
        }
      } catch (e) {
        parsedImages = data.images;
      }

      if (Array.isArray(parsedImages)) {
        listing.images = parsedImages
          .map(img => (typeof img === "string" ? img : img.url))
          .filter(Boolean);
      }
    }

    // Đánh dấu để Mongoose biết các Object lồng nhau đã thay đổi
    listing.markModified("location");
    listing.markModified("images");

    // Đặt lại trạng thái (ví dụ bài đăng sửa xong cần duyệt lại, hoặc để APPROVED tùy bạn)
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
