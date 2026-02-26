import express from "express";

import {
  getAllListings,
  getNearbyListings,
} from "../controllers/listing.controller.js";

import { cacheMiddleware } from "../middleware/cacheMiddleware.js";

const router = express.Router();

router.get("/", cacheMiddleware({ ttl: 300 }), getAllListings);
router.get("/nearby", getNearbyListings);

export default router;
