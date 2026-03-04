import express from "express";
import ListingController from "../controllers/listing.controller.js";
import { cacheMiddleware } from "../middleware/cacheMiddleware.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();
const listingController = new ListingController();

// ==========================================
// PUBLIC ROUTES (Ai cũng có thể xem)
// ==========================================

// Lấy danh sách tin đăng đã duyệt (Có cache 5 phút)
router.get(
  "/",
  cacheMiddleware({ ttl: 300 }),
  listingController.getAllListings
);

// Lấy chi tiết bài đăng
router.get(
  "/:id",
  cacheMiddleware({ ttl: 300 }),
  listingController.getListingById
);

// ==========================================
// PROTECTED ROUTES (Yêu cầu đăng nhập)
// ==========================================

// Lấy danh sách tin cá nhân của người dùng
router.get("/my-listings", authenticate, listingController.getMyListings);

// Tạo bài đăng mới
router.post("/", authenticate, listingController.createListing);

// Cập nhật bài đăng (Chủ sở hữu)
router.put("/:id", authenticate, listingController.updateListing);

// Xóa bài đăng (Chủ sở hữu)
router.delete("/:id", authenticate, listingController.deleteListing);

export default router;