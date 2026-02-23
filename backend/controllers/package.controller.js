// controllers/PackageController.js
import PackageService from "../service/package.service.js";
import asyncHandler from "express-async-handler";

export default class PackageController {
  constructor() {
    this.packageService = new PackageService();
  }

  create = asyncHandler(async (req, res) => {
    console.log("Received request to create package with body:", req.body);
    const pkg = await this.packageService.createPackage(req.body);

    res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: pkg,
    });
  });

  update = asyncHandler(async (req, res) => {
    const pkg = await this.packageService.updatePackage(
      req.params.id,
      req.body,
    );

    res.json({
      success: true,
      message: "Package updated successfully",
      data: pkg,
    });
  });

  getById = asyncHandler(async (req, res) => {
    const pkg = await this.packageService.getById(req.params.id);

    res.json({
      success: true,
      message: "Package fetched successfully",
      data: pkg,
    });
  });

  delete = asyncHandler(async (req, res) => {
    const pkg = await this.packageService.deletePackage(req.params.id);

    res.json({
      success: true,
      message: "Package deleted successfully",
      data: pkg,
    });
  });

  toggleStatus = asyncHandler(async (req, res) => {
    const pkg = await this.packageService.toggleStatus(req.params.id);

    res.json({
      success: true,
      message: "Package status toggled successfully",
      data: pkg,
    });
  });
}
