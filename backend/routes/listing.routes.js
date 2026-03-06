import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import ListingController from "../controllers/listing.controller.js";
import { cacheMiddleware } from "../middleware/cacheMiddleware.js";
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

// Cập nhật
router.put("/:id", authenticate, listingController.updateListing);

// Xóa
router.delete("/:id", authenticate, listingController.deleteListing);

// ==========================================
// PUBLIC ROUTE CHI TIẾT
// ==========================================

router.get("/:id", listingController.getListingById);
// ==========================================
// AI valuation
// ==========================================

router.route("/valuation").post(getValuation);

export default router;