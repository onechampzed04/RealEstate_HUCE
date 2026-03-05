import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./models/UserModel.js";
import Package from "./models/PackageModel.js";
import Listing from "./models/ListingModel.js";
import Payment from "./models/PaymentModel.js";
import Favorite from "./models/FavoriteModel.js";
import Report from "./models/ReportModel.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // ⚠ Reset database (chỉ dùng cho dev)
    await Promise.all([
      User.deleteMany(),
      Package.deleteMany(),
      Listing.deleteMany(),
      Payment.deleteMany(),
      Favorite.deleteMany(),
      Report.deleteMany(),
    ]);

    console.log("Old data removed");

    // =========================
    // 1️⃣ CREATE PACKAGES
    // =========================
    const basicPackage = await Package.create({
      name: "Basic",
      maxPostsPerDay: 3,
      price: 100000,
      durationDays: 30,
    });

    const premiumPackage = await Package.create({
      name: "Premium",
      maxPostsPerDay: 10,
      price: 300000,
      durationDays: 30,
      allowHotPost: true,
      autoApprove: true,
    });

    // =========================
    // 2️⃣ CREATE USERS
    // =========================
    const user = await User.create({
      name: "Nguyen Van Kien",
      email: "kien@test.com",
      password: "123456",
      package: basicPackage._id,
    });

    const admin = await User.create({
      name: "Admin",
      email: "admin@test.com",
      password: "123456",
      role: "ADMIN",
    });
    // =========================
    // 3️⃣ CREATE LISTINGS
    // =========================
    const listing1 = await Listing.create({
      user: user._id,
      title: "Bán căn hộ Quận 7",
      description: "Căn hộ view sông đẹp",
      type: "SALE",
      slug: "ban-can-ho-quan-7",
      propertyType: "APARTMENT",
      price: 2500000000,
      area: 75,
      location: {
        type: "Point",
        coordinates: [106.7218, 10.7326],
        city: "Ho Chi Minh",
        district: "District 7",
        ward: "Tan Phu",
        address: "123 Nguyen Huu Tho",
      },
      status: "APPROVED",
    });

    const listing2 = await Listing.create({
      user: user._id,
      title: "Cho thuê nhà Quận 2",
      type: "RENT",
      slug: "cho-thue-nha-quan-2",
      propertyType: "HOUSE",
      price: 20000000,
      area: 120,
      location: {
        type: "Point",
        coordinates: [106.75, 10.79],
        city: "Ho Chi Minh",
        district: "District 2",
      },
      status: "APPROVED",
    });

    // =========================
    // 4️⃣ CREATE PAYMENT
    // =========================
    await Payment.create({
      user: user._id,
      package: basicPackage._id,
      amount: basicPackage.price,
      paymentMethod: "VNPAY",
      transactionId: "TXN123456",
      status: "SUCCESS",
      paidAt: new Date(),
    });

    // =========================
    // 5️⃣ CREATE FAVORITE
    // =========================
    await Favorite.create({
      user: user._id,
      listing: listing2._id,
    });

    // =========================
    // 6️⃣ CREATE REPORT
    // =========================
    await Report.create({
      reporter: user._id,
      listing: listing1._id,
      reason: "Thông tin không chính xác",
      status: "pending",
    });

    console.log("✅ Seed data created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seed();
