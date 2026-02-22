import asyncHandler from 'express-async-handler';
import Property from '../models/PropertyModel.js';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Tạo __dirname tương đương trong ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Đường dẫn tuyệt đối đến file Python (an toàn khi deploy)
const PYTHON_SCRIPT_PATH = join(__dirname, '..', 'AI_Model', 'predict_price.py');

// Hàm helper để chạy Python script và trả về Promise (dễ await)
function runPythonScript(inputData) {
  return new Promise((resolve, reject) => {
    // Dùng python3 để tương thích server Linux (nếu máy bạn dùng python thì đổi lại 'python')
    const python = spawn(
  'C:\\Users\\nct\\anaconda3\\python.exe',  // ← đường dẫn chính xác từ log của bạn
  [PYTHON_SCRIPT_PATH]
);

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.error('Python stderr:', errorOutput.trim());
        return reject(new Error(`Python process exited with code ${code}: ${errorOutput.trim()}`));
      }

      try {
        const result = JSON.parse(output.trim());
        if (result.error) {
          return reject(new Error(result.error));
        }
        resolve(result.predicted_price);
      } catch (err) {
        reject(new Error(`JSON parse error: ${err.message}\nRaw output: ${output.trim()}`));
      }
    });

    // Gửi dữ liệu input JSON vào stdin của Python, đảm bảo UTF-8
    const inputStr = JSON.stringify(inputData);
    python.stdin.write(Buffer.from(inputStr, 'utf-8'));
    python.stdin.end();
  });
}

// @desc    Fetch all properties
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({});
  res.json(properties);
});

// @desc    Fetch featured properties (first 3)
// @route   GET /api/properties/featured
// @access  Public
const getFeaturedProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({}).limit(3);
  res.json(properties);
});

// @desc    Fetch single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (property) {
    res.json(property);
  } else {
    res.status(404);
    throw new Error('Property not found');
  }
});

// @desc    Calculate property valuation
// @route   POST /api/properties/valuation
// @access  Public
const getValuation = asyncHandler(async (req, res) => {
  try {
    const details = req.body;

    // In ra dữ liệu thô nhận được từ frontend để debug
    console.log('Received raw data from frontend:', JSON.stringify(details, null, 2));

    // Validation cơ bản: Đảm bảo có address và area
    // Script Python sẽ xử lý chi tiết hơn
    if (!details.address || !details.area || details.area <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Thiếu thông tin bắt buộc: address và area (phải > 0)' 
      });
    }

    // Gọi Python và chờ kết quả. Dữ liệu `details` được truyền thẳng mà không qua xử lý.
    const predictedPrice = await runPythonScript(details);

    res.json({
      success: true,
      valuation: predictedPrice   // số tỷ VND
    });

  } catch (error) {
    console.error('Valuation error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi định giá bằng AI',
      error: error.message   // gửi chi tiết lỗi về frontend để debug
    });
  }
});

export { 
  getProperties, 
  getFeaturedProperties, 
  getPropertyById, 
  getValuation 
};