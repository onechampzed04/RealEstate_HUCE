import express from "express";

import ListingController from "../controllers/listing.controller.js";
import { cacheMiddleware } from "../middleware/cacheMiddleware.js";

const router = express.Router();
const listingController = new ListingController();

router.get(
  "/",
  cacheMiddleware({ ttl: 300 }),
  listingController.getAllListings,
);

export default router;
