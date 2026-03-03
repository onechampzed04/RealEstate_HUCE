import { clearAllCache, clearCacheKey } from "../middleware/cacheMiddleware.js";
import User from "../models/UserModel.js";
class UserService {
  constructor() {
    clearCacheKey("users");
    // Khởi tạo các thuộc tính hoặc kết nối cơ sở dữ liệu nếu cần
  }

  async getUserAll(query) {
    const {
      search,
      phone,
      email,
      name,
      status,
      role,
      isActive,
      page = 1,
      limit = 10,
    } = query;

    const filter = {};

    // 🔒 Loại trừ ADMIN mặc định
    if (role) {
      filter.role = role;
    } else {
      filter.role = { $ne: "ADMIN" };
    }

    // 🔎 Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } }, // name cho phép chứa
        { email: search.toLowerCase() }, // email chính xác
        { phone: search }, // phone chính xác
      ];
    }

    // 🔥 Fix boolean
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const skip = (page - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .lean();

    const total = await User.countDocuments(filter);

    return {
      users,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async softDeleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.isActive = false;
    await user.save();
    clearCacheKey("users");
    return { message: "User soft deleted successfully" };
  }
  async restoreUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.isActive = true;
    await user.save();
    clearCacheKey("users");
    return { message: "User restored successfully" };
  }
}

export default UserService;
