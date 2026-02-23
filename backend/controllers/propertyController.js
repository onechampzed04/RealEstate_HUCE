import asyncHandler from "express-async-handler";
import ListingModel from "../models/ListingModel.js";

// @desc    Fetch all properties
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const properties = await ListingModel.find({});
  res.json(properties);
});

// @desc    Fetch featured properties (first 3)
// @route   GET /api/properties/featured
// @access  Public
const getFeaturedProperties = asyncHandler(async (req, res) => {
  const properties = await ListingModel.find({}).limit(3);
  res.json(properties);
});

// @desc    Fetch single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await ListingModel.findById(req.params.id);

  if (property) {
    res.json(property);
  } else {
    res.status(404);
    throw new Error("ListingModel not found");
  }
});

// @desc    Calculate property valuation
// @route   POST /api/properties/valuation
// @access  Public
const getValuation = asyncHandler(async (req, res) => {
  const details = req.body;
  // Simple mock valuation logic
  const basePrice = 20000000; // 20 million VND
  const areaValue = (details.area || 50) * 10000000;
  const bedroomValue = (details.bedrooms || 1) * 50000000;
  const locationMultiplier = details.location === "center" ? 1.5 : 1.0;

  const valuation = (basePrice + areaValue + bedroomValue) * locationMultiplier;

  res.json({ valuation });
});

export { getProperties, getPropertyById, getFeaturedProperties, getValuation };
