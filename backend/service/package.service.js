import { clearAllCache, clearCacheKey } from "../middleware/cacheMiddleware.js";
import Package from "../models/PackageModel.js";
import mongoose from "mongoose";

export default class PackageService {
  invalidateCache() {
    clearCacheKey("packages");
  }

  async getAllActivePackages() {
    const packages = await Package.find({ isActive: true }).sort({ priority: -1, price: 1 });
    return packages;
  }

  async getAllPackages() {
    const packages = await Package.find().sort({ priority: -1, price: 1 });
    return packages;
  }

  async createPackage(data) {
    console.log("Creating package with data:", data);
    const {
      name,
      type,
      description,
      maxPostsPerDay,
      maxTotalPosts,
      price,
      durationDays,
      allowHotPost,
      autoApprove,
      priority,
    } = data;

    if (!name || !type || price === undefined || !durationDays) {
      throw new Error("Missing required fields");
    }

    const existing = await Package.findOne({ name });
    if (existing) throw new Error("Package name already exists");

    const pkg = await Package.create({
      name,
      type,
      description,
      maxPostsPerDay,
      maxTotalPosts,
      price,
      durationDays,
      allowHotPost,
      autoApprove,
      priority,
    });

    this.invalidateCache();

    // emitRealtimeEvent("package:created", {
    //   packageId: pkg._id,
    //   name: pkg.name,
    //   type: pkg.type,
    // });

    return pkg;
  }

  async updatePackage(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid package ID");
    }

    const pkg = await Package.findById(id);
    if (!pkg) throw new Error("Package not found");

    const fields = [
      "name",
      "type",
      "description",
      "maxPostsPerDay",
      "maxTotalPosts",
      "price",
      "durationDays",
      "allowHotPost",
      "autoApprove",
      "priority",
      "isActive",
    ];

    fields.forEach((field) => {
      if (data[field] !== undefined) {
        pkg[field] = data[field];
      }
    });

    await pkg.save();

    this.invalidateCache();

    // emitRealtimeEvent("package:updated", {
    //   packageId: pkg._id,
    // });

    return pkg;
  }

  async getById(id) {
    const pkg = await Package.findById(id);
    if (!pkg) throw new Error("Package not found");
    return pkg;
  }

  /**
   * Soft Delete Package
   */
  async deletePackage(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid package ID");
    }

    const pkg = await Package.findByIdAndUpdate(
      id,
      { isActive: false },
      // { new: true },
    );

    if (!pkg) throw new Error("Package not found");

    this.invalidateCache();

    emitRealtimeEvent("package:deleted", {
      packageId: pkg._id,
    });

    return pkg;
  }

  // backend/service/package.service.js
async toggleStatus(id) {
    const pkg = await Package.findById(id);
    if (!pkg) throw new Error("Package not found");

    pkg.isActive = !pkg.isActive;
    await pkg.save();
    return pkg; // Phải return pkg để Controller nhận được giá trị mới
}
}
