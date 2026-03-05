import { clearAllCache, clearCacheByPrefix } from "../middleware/cacheMiddleware.js";
import User from "../models/UserModel.js";
class UserService {
  constructor() {
    clearCacheByPrefix("users");
    // Khởi tạo các thuộc tính hoặc kết nối cơ sở dữ liệu nếu cần
  }

  async getUserAll(query) {
    const {
      search,
      role,
      isActive,
      package: packageId,
      sort = {},
      page = 1,
      limit = 8,
    } = query;

    const filter = {};

    // 🔒 Loại trừ ADMIN mặc định
    filter.role = role ? role : { $ne: "ADMIN" };

    // 🔎 Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const skip = (page - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // ===== MULTI SORT =====

    const allowedSortFields = ["createdAt", "name", "isActive", "package"];

    let mongoSort = {};

    Object.entries(sort).forEach(([field, order]) => {
      if (!allowedSortFields.includes(field)) return;

      const direction = order === "asc" ? 1 : -1;

      switch (field) {
        case "name":
          mongoSort["nameLower"] = direction;
          break;

        case "package":
          mongoSort["packageNameLower"] = direction;
          break;

        default:
          mongoSort[field] = direction;
      }
    });

    // fallback
    if (Object.keys(mongoSort).length === 0) {
      mongoSort = { createdAt: -1 };
    }

    const result = await User.aggregate([
      { $match: filter },

      {
        $lookup: {
          from: "userpackages",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", "$$userId"] },
                    { $eq: ["$status", "ACTIVE"] },
                    ...(packageId
                      ? [
                          {
                            $eq: [
                              "$package",
                              new mongoose.Types.ObjectId(packageId),
                            ],
                          },
                        ]
                      : []),
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "packages",
                localField: "package",
                foreignField: "_id",
                as: "package",
              },
            },
            {
              $unwind: {
                path: "$package",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "currentPackage",
        },
      },

      {
        $unwind: {
          path: "$currentPackage",
          preserveNullAndEmptyArrays: !packageId,
        },
      },

      ...(packageId
        ? [{ $match: { currentPackage: { $ne: null } } }]
        : []),

      // 👇 luôn tạo nameLower để sort ổn định
      {
        $addFields: {
          nameLower: { $toLower: "$name" },
          packageNameLower: {
            $toLower: {
              $ifNull: ["$currentPackage.package.name", ""]
            }
          }
        },
      },

      {
        $facet: {
          users: [
            { $sort: mongoSort },
            { $skip: skip },
            { $limit: limitNum },
            {
              $project: {
                password: 0,
                nameLower: 0,
              },
            },
          ],
          totalCount: [{ $count: "total" }],
        },
      },
    ]);

    const users = result[0].users;
    const total = result[0].totalCount[0]?.total || 0;

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
    if (!user) throw new Error("User not found");
    user.isActive = false;
    await user.save();
    clearCacheByPrefix("/api/users"); // ← dùng đúng prefix từ key thực tế
    return { message: "User soft deleted successfully" };
  }

  async restoreUser(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    user.isActive = true;
    await user.save();
    clearCacheByPrefix("/api/users"); // ← tương tự
    return { message: "User restored successfully" };
  }

  async viewUserDetails(userId) {
    const user = await User.findById(userId)
      .select("-password -__v")
      .lean();

    if (!user) {
      throw new Error("User not found");
    }

    return {
      message: "User fetched successfully",
      user,
    };
  }
  async editUser(userId, updateData) {
    const allowedFields = ["name", "email", "phone"];

    const filteredData = {};

    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        filteredData[key] = updateData[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      filteredData,
      {
        new: true,
        runValidators: true,
        select: "-password -__v",
      }
    );

    if (!user) {
      throw new Error("User not found");
    }

    clearCacheByPrefix("/api/users");

    return {
      message: "User updated successfully",
      user,
    };
  }
}

export default UserService;
