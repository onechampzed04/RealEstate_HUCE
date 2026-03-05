import express from "express";

import { cacheMiddleware } from "../middleware/cacheMiddleware.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import PackageController from "../controllers/package.controller.js";
import { validate } from "../middleware/validateMiddlware.js";
import {
  createPackageSchema,
  updatePackageSchema,
} from "../validator/package.validator.js";
const router = express.Router();
const controller = new PackageController();
router.get("/", controller.getAll);
router.get("/admin", authenticate, isAdmin, controller.getAllForAdmin);
router.post(
  "/",
  authenticate,
  isAdmin,
  validate(createPackageSchema),
  controller.create,
);
router.put(
  "/:id",
  authenticate,
  isAdmin,
  validate(updatePackageSchema),
  controller.update,
);
router.get("/:id", authenticate, isAdmin, controller.getById);
router.delete("/:id", authenticate, isAdmin, controller.delete);
router.patch("/:id/toggle", authenticate, isAdmin, controller.toggleStatus);
export default router;
