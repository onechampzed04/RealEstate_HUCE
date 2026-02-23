import UserPackageService from "../service/userPackage.service";
import asyncHandler from "express-async-handler";

export const purchasePackage = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  console.log("User ID from token:", req.user);
  const { packageId } = req.body;

  const userPackageService = new UserPackageService();
  try {
    const userPackage = await userPackageService.purchasePackage(
      userId,
      packageId,
    );
    res.json({
      success: true,
      message: "Package purchased successfully",
      data: userPackage,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to purchase package",
    });
  }
});
