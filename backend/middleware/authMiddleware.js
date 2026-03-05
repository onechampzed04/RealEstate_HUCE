import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import { JWT_CONFIG } from "../config/jwt.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Không được phép, không có token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, JWT_CONFIG.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", req.method, req.originalUrl, decoded); // Debugging line
    // 3️⃣ Tìm user từ decoded data
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User không tồn tại",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn đã bị vô hiệu hóa",
      });
    }

    // 4️⃣ Attach user info vào request
    req.user = user;
    req.userId = decoded.id;
    req.userRole = decoded.role;

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

/**
 * Middleware để kiểm tra quyền Admin
 */
export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Token không được tìm thấy",
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập tài nguyên này",
      });
    }

    next();
  };
};

export const isAdmin = authorize(["ADMIN"]);

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // If no token, just continue (anonymous user)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (user) {
      req.user = user;
      req.userId = decoded.id;
      req.userRole = decoded.role;
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
