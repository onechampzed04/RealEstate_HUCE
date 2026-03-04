import express from "express";
import ListingController from "../controllers/listing.controller.js";
import { cacheMiddleware } from "../middleware/cacheMiddleware.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();
const listingController = new ListingController();

// Lấy tất cả listings
router.get(
  "/",
  cacheMiddleware({ ttl: 300 }),
  listingController.getAllListings
);

// Lấy listing gần vị trí
router.get(
  "/nearby",
  listingController.getNearbyListings
);

// AI định giá
router.post(
  "/valuation",
  listingController.getValuation
);

router.get("/my-listings", authenticate, listingController.getMyListings);
// Lấy listing theo ID
router.get(
  "/:id", listingController.getListingById
);


export default router;