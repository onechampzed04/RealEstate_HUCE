import asyncHandler from "express-async-handler";
import ListingService from "../service/listing.service.js";

import { spawn } from 'child_process'; // Thêm import này
import { fileURLToPath } from 'url';     // Thêm import này
import { dirname, join } from 'path';    // Thêm import này

export default class ListingController {
  constructor() {
    this.listingService = new ListingService();
  }

  getAllListings = asyncHandler(async (req, res) => {
    const result = await this.listingService.getAll(req.query);

    console.log("cache hỏng, lấy dữ liệu mới từ database");

    res.json({
      success: true,
      message: "Lấy danh sách bất động sản thành công",
      data: result,
    });
  });
}

// ===============================================================
// PHẦN LOGIC ĐỊNH GIÁ AI (Được chuyển từ propertyController cũ)
// ===============================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Đường dẫn đến script Python, tính từ vị trí của controller hiện tại
const PYTHON_SCRIPT_PATH = join(__dirname, '..', 'AI_Model', 'predict_price.py');

/**
 * Hàm gọi kịch bản Python để thực hiện dự đoán giá.
 * @param {object} inputData - Dữ liệu đầu vào cho model AI (đã có trường 'address').
 * @returns {Promise<object>} - Một promise sẽ trả về kết quả từ script Python.
 */
function runPythonScript(inputData) {
  return new Promise((resolve, reject) => {
    // Đảm bảo đường dẫn đến python.exe của bạn là chính xác
    const python = spawn('C:\\Users\\NCT\\anaconda3\\python.exe', [PYTHON_SCRIPT_PATH]);    
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
          reject(new Error(result.message || 'Lỗi không xác định từ Python script.'));
        }
      } catch (err) {
        reject(new Error(`Lỗi hệ thống Python hoặc không thể parse JSON. Stderr: ${errorOutput.trim()}`));
      }
    });

    python.stdin.write(JSON.stringify(inputData));
    python.stdin.end();
  });
}

/**
 * @desc    Nhận dữ liệu, tính toán giá trị bất động sản bằng AI
 * @route   POST /api/listings/valuation
 * @access  Public
 */
export const getValuation = asyncHandler(async (req, res) => {
  try {
    // Dữ liệu `details` được gửi từ ValuationPage.tsx
    const details = req.body;
    
    if (!details.address || !details.area || details.area <= 0) {
      res.status(400);
      throw new Error('Thiếu thông tin bắt buộc: address và area (> 0)');
    }
    
    console.log('Dữ liệu nhận được để định giá:', JSON.stringify(details, null, 2));

    const result = await runPythonScript(details);

    res.json({
      success: true,
      valuation: result.predicted_price,
    });

  } catch (error) {
    console.error('Valuation error in Controller:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
