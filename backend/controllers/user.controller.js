import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import UserService from "../service/user.service.js";

const userService = new UserService();

// 📌 GET /api/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const result = await userService.getUserAll(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});

// 🗑 DELETE /api/users/:id (soft delete)
export const softDeleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const result = await userService.softDeleteUser(id);

  res.status(200).json({
    success: true,
    ...result,
  });
});

// ♻️ PATCH /api/users/:id/restore
export const restoreUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const result = await userService.restoreUser(id);

  res.status(200).json({
    success: true,
    ...result,
  });
});
