import express from "express";
import ListingController from "../controllers/listing.controller.js";
import { cacheMiddleware } from "../middleware/cacheMiddleware.js";

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

export default router;