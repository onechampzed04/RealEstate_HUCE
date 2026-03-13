import asyncHandler from "express-async-handler";
import ListingService from "../service/listing.service.js";
import { uploadImage } from "../service/image.service.js";

// GIỮ LẠI CÁC IMPORT CỦA AI
import { spawn } from 'child_process'; 
import { fileURLToPath } from 'url';    
import { dirname, join } from 'path';    

const listingService = new ListingService();

export default class ListingController {
  constructor() {
    this.listingService = listingService;
  }

  // 1. Lấy danh sách (Hòa trộn log của bạn và code của 'than')
  getAllListings = asyncHandler(async (req, res) => {
    const result = await this.listingService.getAll(req.query);
    console.log("cache hỏng, lấy dữ liệu mới từ database"); // Giữ lại log của bạn nếu cần
    res.json({
      success: true,
      message: "Lấy danh sách bất động sản thành công",
      data: result,
    });
  });

  // 2. Lấy chi tiết (Thêm từ nhánh 'than')
  getListingById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const listing = await this.listingService.getById(id);
    if (!listing) {
      res.status(404);
      throw new Error("Không tìm thấy bài đăng");
    }
    res.json({ success: true, data: listing });
  });

  // 3. Lấy tin của tôi (Thêm từ nhánh 'than')
  getMyListings = asyncHandler(async (req, res) => {
    const listings = await this.listingService.getMyListings(req.userId, req.query);
    res.json({ success: true, data: listings });
  });

  // 4. Tạo tin mới (Thêm từ nhánh 'than')
  createListing = asyncHandler(async (req, res) => {
    const listing = await this.listingService.create(req.userId, req.body);
    res.status(201).json({
      success: true,
      message: "Đăng tin thành công! Vui lòng chờ quản trị viên phê duyệt.",
      data: listing,
    });
  });

  // 5. Cập nhật tin
  updateListing = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { files } = req;
    
    let imageUrls = [];

    // Nếu có file mới, upload lên Cloudinary
    if (files && files.length > 0) {
      for (const file of files) {
        const result = await uploadImage(file.buffer);
        imageUrls.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    // Lấy danh sách ảnh cũ được gửi từ frontend
    let finalImages = [];
    if (req.body.existingImages) {
      try {
        finalImages = JSON.parse(req.body.existingImages);
      } catch (e) {
        finalImages = [];
      }
    }

    // Hợp nhất ảnh cũ (còn giữ lại) và ảnh mới
    finalImages = [...finalImages, ...imageUrls];

    // Tạo updateData từ req.body nhưng đảm bảo lấy đúng các trường
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      propertyType: req.body.propertyType,
      price: req.body.price,
      area: req.body.area,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      floors: req.body.floors,
      furniture_state: req.body.furniture_state,
      frontage: req.body.frontage || 0,
      address: req.body.address,
      city: req.body.city,
      district: req.body.district,
      ward: req.body.ward,
      images: finalImages,
    };

    const updatedListing = await this.listingService.update(id, req.userId, updateData);

    res.json({
      success: true,
      message: "Cập nhật thành công. Bài đăng đã được gửi lại để duyệt.",
      data: updatedListing,
    });
  });

  // 6. Xóa tin
  deleteListing = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await this.listingService.delete(id, req.userId);
    res.json({
      success: true,
      message: "Đã xóa bài đăng thành công",
    });
  });
}

// ===============================================================
// PHẦN LOGIC ĐỊNH GIÁ AI (GIỮ NGUYÊN PHẦN NÀY CỦA BẠN)
// ===============================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PYTHON_SCRIPT_PATH = join(__dirname, '..', 'AI_Model', 'predict_price.py');

function runPythonScript(inputData) {
  return new Promise((resolve, reject) => {
    const python = spawn('python', [PYTHON_SCRIPT_PATH]);
    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => { output += data.toString(); });
    python.stderr.on('data', (data) => { errorOutput += data.toString(); });
    python.on('close', (code) => {
      try {
        const result = JSON.parse(output.trim());
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error(result.message || 'Lỗi từ Python script.'));
        }
      } catch (err) {
        reject(new Error(`Lỗi parse JSON: ${errorOutput.trim()}`));
      }
    });

    python.stdin.write(JSON.stringify(inputData));
    python.stdin.end();
  });
}

export const getValuation = asyncHandler(async (req, res) => {
  try {
    const details = req.body;
    if (!details.address || !details.area || details.area <= 0) {
      res.status(400);
      throw new Error('Thiếu thông tin: address và area');
    }
    const result = await runPythonScript(details);
    res.json({ success: true, valuation: result.predicted_price });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});