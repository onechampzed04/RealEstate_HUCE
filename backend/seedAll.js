import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import User from "./models/UserModel.js";
import Listing from "./models/ListingModel.js";
import Favorite from "./models/FavoriteModel.js";
import ContactMessage from "./models/ContactMessageModel.js";
import ListingImage from "./models/ListingImageModel.js";
import Package from "./models/PackageModel.js";
import Payment from "./models/PaymentModel.js";
import Report from "./models/ReportModel.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log("🚀 Seeding database...");

    await Promise.all([
      User.deleteMany(),
      Listing.deleteMany(),
      Favorite.deleteMany(),
      ContactMessage.deleteMany(),
      ListingImage.deleteMany(),
      Package.deleteMany(),
      Payment.deleteMany(),
      Report.deleteMany(),
    ]);

    const hashedPassword = await bcrypt.hash("123456", 10);

    const user = await User.create({
      name: "Nguyễn Văn Admin",
      email: "admin@test.com",
      password: hashedPassword,
    });

    const user2 = await User.create({
      name: "Trần Văn User",
      email: "user@test.com",
      password: hashedPassword,
    });

    const listing = await Listing.create({
      title: "Biệt Thự Cao Cấp Thảo Điền",
      price: 25000000000,
      address: "123 Thảo Điền",
      city: "TP Hồ Chí Minh",
      bedrooms: 5,
      bathrooms: 4,
      area: 450,
      description: "Biệt thự sang trọng có hồ bơi riêng và sân vườn.",
    });

    await Favorite.create({
      user: user2._id,
      listing: listing._id,
    });

    await ListingImage.create({
      listing: listing._id,
      imageUrl: "https://picsum.photos/800/600",
    });

    const pkg = await Package.create({
      name: "Premium 30 ngày",
      price: 500000,
      duration: 30,
    });

    await Payment.create({
      user: user2._id,
      package: pkg._id,
      amount: 500000,
      status: "Paid",
    });

    await ContactMessage.create({
      name: "Lê Văn A",
      email: "contact@gmail.com",
      message: "Tôi muốn xem nhà này vào cuối tuần.",
    });

    await Report.create({
      listing: listing._id,
      reason: "Thông tin sai lệch",
    });

    console.log("🎉 Seed database thành công!");
    process.exit();
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectDB(); // ✅ QUAN TRỌNG
  await seedDatabase();
};

runSeed();
