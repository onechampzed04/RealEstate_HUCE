import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import ListingController from "../controllers/listing.controller.js";
import { cacheMiddleware } from "../middleware/cacheMiddleware.js";
import upload from "../middleware/upload.middleware.js";
import { getValuation } from "../controllers/listing.controller.js";

const router = express.Router();
const listingController = new ListingController();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Lấy danh sách tin đăng
router.get(
  "/",
  cacheMiddleware({ ttl: 300 }),
  listingController.getAllListings
);

// ==========================================
// PROTECTED ROUTES
// ==========================================

// ⚠️ PHẢI ĐẶT TRƯỚC /:id
router.get("/my-listings", authenticate, listingController.getMyListings);

// Tạo bài đăng
router.post("/", authenticate, listingController.createListing);

// Cập nhật (cho phép tối đa 10 ảnh)
router.put("/:id", authenticate, upload.array("images", 10), listingController.updateListing);

// Xóa
router.delete("/:id", authenticate, listingController.deleteListing);

// ==========================================
// PUBLIC ROUTE CHI TIẾT
// ==========================================

router.get(
  "/:id",
  cacheMiddleware({ ttl: 300 }),
  listingController.getListingById
);

// ==========================================
// AI valuation
// ==========================================

router.route("/valuation").post(getValuation);

export default router;
