import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debugging line
    // 3️⃣ Tìm user từ decoded data
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User không tồn tại",
      });
    }

    // 4️⃣ Attach user info vào request
    req.user = user;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token đã hết hạn",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
});

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Token không được tìm thấy",
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Yêu cầu quyền Admin",
    });
  }

  next();
};

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // If no token, just continue (anonymous user)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (user) {
      req.user = user;
      req.userId = decoded.userId;
    }
  } catch (error) {
    // Token invalid, but continue anyway (treat as anonymous)
    console.log(
      "Optional auth failed, continuing as anonymous:",
      error.message,
    );
  }

  next();
});
