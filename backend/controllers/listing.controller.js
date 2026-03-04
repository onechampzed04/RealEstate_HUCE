import asyncHandler from "express-async-handler";
import ListingService from "../service/listing.service.js";
import Listing from "../models/ListingModel.js";

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

export default class ListingController {
  constructor() {
    this.listingService = new ListingService();
  }

  // ===============================================================
  // LẤY TẤT CẢ LISTINGS
  // ===============================================================
  getAllListings = asyncHandler(async (req, res) => {
    const result = await this.listingService.getAll(req.query);

    console.log("cache hỏng, lấy dữ liệu mới từ database");
    console.log("cache hỏng, lấy dữ liệu mới từ database");

    res.json({
      success: true,
      message: "Lấy danh sách bất động sản thành công",
      data: result,
    });
  });

  // ===============================================================
  // LẤY LISTING GẦN VỊ TRÍ
  // ===============================================================
  getNearbyListings = asyncHandler(async (req, res) => {
    const { lat, lng, radius = 3000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Thiếu lat hoặc lng",
      });
    }

    const listings = await Listing.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: "distance",
          maxDistance: parseInt(radius),
          spherical: true,
        },
      },
      {
        $match: { status: "APPROVED" },
      },
    ]);

    res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  });

  // ===============================================================
// LẤY LISTING THEO ID
// ===============================================================
getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy bất động sản",
    });
  }

  res.json({
    success: true,
    data: listing,
  });
});

// ===============================================================
// LẤY DANH SÁCH BẤT ĐỘNG SẢN CỦA NGƯỜI DÙNG (PROFILE)
// ===============================================================
getMyListings = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;

  let filter = {};

  // Nếu là admin → có thể xem tất cả và lọc theo status
  if (req.user.role === "ADMIN") {
    if (status) {
      filter.status = status; // lọc theo trạng thái
    }
  } 
  // Nếu là user thường → chỉ xem bài của chính mình
  else {
    filter.user = userId;
    if (status) {
      filter.status = status; // có thể lọc PENDING / APPROVED của chính mình
    }
  }

  const listings = await Listing.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
});
  // ===============================================================
  // ĐỊNH GIÁ AI
  // ===============================================================
  getValuation = asyncHandler(async (req, res) => {
    try {
      const details = req.body;

      if (!details.address || !details.area || details.area <= 0) {
        res.status(400);
        throw new Error("Thiếu thông tin bắt buộc: address và area (> 0)");
      }

      console.log(
        "Dữ liệu nhận được để định giá:",
        JSON.stringify(details, null, 2)
      );

      const result = await runPythonScript(details);

      res.json({
        success: true,
        valuation: result.predicted_price,
      });
    } catch (error) {
      console.error("Valuation error in Controller:", error.message);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
}

// ===============================================================
// LOGIC GỌI PYTHON SCRIPT
// ===============================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PYTHON_SCRIPT_PATH = join(
  __dirname,
  "..",
  "AI_Model",
  "predict_price.py"
);

function runPythonScript(inputData) {
  return new Promise((resolve, reject) => {
    const python = spawn(
      "C:\\Users\\NCT\\anaconda3\\python.exe",
      [PYTHON_SCRIPT_PATH]
    );

    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", () => {
      try {
        const result = JSON.parse(output.trim());

        if (result.success) {
          resolve(result);
        } else {
          reject(
            new Error(
              result.message || "Lỗi không xác định từ Python script."
            )
          );
        }
      } catch (err) {
        reject(
          new Error(
            `Lỗi hệ thống Python hoặc không thể parse JSON. Stderr: ${errorOutput.trim()}`
          )
        );
      }
    });

    python.stdin.write(JSON.stringify(inputData));
    python.stdin.end();
  });
}