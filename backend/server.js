import dotenv from "dotenv";
dotenv.config();

console.log("[SERVER] Environment loaded. DEV_MODE:", process.env.DEV_MODE);

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import uploadRoutes from "./routes/upload.routes.js";
import authRoutes from "./routes/auth.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import packageRoutes from "./routes/package.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import userPackageRoutes from "./routes/userPackage.routes.js";
import user from "./routes/user.routes.js";
import cron from "node-cron";
import CronService from "./service/cron.service.js";

connectDB();

const app = express();
const cronService = new CronService();
cron.schedule(
  "0 0 * * *",
  async () => {
    console.log("--- [CRON START] Bắt đầu chạy các tác vụ hàng ngày ---");

    // Chạy tác vụ 1: Reset credit trong ngày
    await cronService.resetDailyPosts();

    // Chạy tác vụ 2: Kiểm tra các gói đã hết hạn
    await cronService.checkExpiredPackages();

    console.log("--- [CRON END] Đã hoàn thành các tác vụ hàng ngày ---");
  },
  {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh", // Đặt múi giờ Việt Nam
  },
);

console.log(
  "✅ Cron job để reset credit và kiểm tra hết hạn đã được lên lịch.",
);

app.use(cors());
app.use(express.json());

app.use("/api/packages", packageRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", authRoutes);
app.use("/api/user-packages", userPackageRoutes);
app.use("/api/user", user);

app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
