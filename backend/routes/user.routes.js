import express from "express";
import UserPackageController from "../controllers/userPackage.controller.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import * as userController from "../controllers/user.controller.js";
import { cacheMiddleware } from "../middleware/cacheMiddleware.js";

const router = express.Router();
const userPackageController = new UserPackageController();

const { getMyActivePackage, purchasePackage } = userPackageController;
router.post("/purchase", authenticate, purchasePackage);
router.get(
  "/users",
  authenticate,
  isAdmin,
  cacheMiddleware({ ttl: 300 }),
  userController.getAllUsers,
);
router.patch("/users/:id/soft-delete", authenticate, isAdmin, userController.softDeleteUser);
router.patch("/users/:id/restore", authenticate, isAdmin, userController.restoreUser);
router.get("/users/:id", authenticate, isAdmin, userController.viewUserDetails);
router.put("/users/:id/edit", authenticate, isAdmin, userController.editUser);

export default router;
