import asyncHandler from 'express-async-handler';

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const PYTHON_SCRIPT_PATH = join(__dirname, '..', 'AI_Model', 'predict_price.py');


function runPythonScript(inputData) {
  return new Promise((resolve, reject) => {
    // Luôn đảm bảo đường dẫn chính xác đến file thực thi python.exe của bạn
    const python = spawn('python', [PYTHON_SCRIPT_PATH]);
    
    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => { output += data.toString(); });
    python.stderr.on('data', (data) => { errorOutput += data.toString(); });

    python.on('close', (code) => {
      // Script Python mới sẽ LUÔN trả về JSON, kể cả khi có lỗi
      // Vì vậy, chúng ta sẽ luôn cố gắng parse output
      try {
        const result = JSON.parse(output.trim());
        if (result.success) {
          resolve(result); // Trả về { success: true, predicted_price: ... }
        } else {
          // Trả về lỗi có chủ đích từ Python, ví dụ { success: false, message: "..." }
          reject(new Error(result.message || 'Lỗi không xác định từ Python script.'));
        }
      } catch (err) {
        // Nếu không parse được JSON, nghĩa là đã có lỗi hệ thống nghiêm trọng
        reject(new Error(`Lỗi hệ thống Python hoặc không thể parse JSON. Stderr: ${errorOutput.trim()}`));
      }
    });

    // Gửi dữ liệu vào stdin của Python
    python.stdin.write(JSON.stringify(inputData));
    python.stdin.end();
  });
}

const getValuation = asyncHandler(async (req, res) => {
  try {
    const details = req.body;
    
    if (!details.address || !details.area || details.area <= 0) {
      res.status(400);
      throw new Error('Thiếu thông tin bắt buộc: address và area (> 0)');
    }
    
    const result = await runPythonScript(details);

    res.json({
      success: true,
      valuation: result.predicted_price, // Chia 1 tỷ để ra đơn vị tỷ VND
    });

  } catch (error) {
    // Giờ đây, error.message sẽ chứa thông điệp lỗi rõ ràng hơn từ Python
    console.error('Valuation error in Controller:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


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
// const getValuation = asyncHandler(async (req, res) => {
//   try {
//     const details = req.body;

//     // In ra dữ liệu thô nhận được từ frontend để debug
//     console.log('Received raw data from frontend:', JSON.stringify(details, null, 2));

//     // Validation cơ bản: Đảm bảo có address và area
//     // Script Python sẽ xử lý chi tiết hơn
//     if (!details.address || !details.area || details.area <= 0) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Thiếu thông tin bắt buộc: address và area (phải > 0)' 
//       });
//     }

//     // Gọi Python và chờ kết quả. Dữ liệu `details` được truyền thẳng mà không qua xử lý.
//     const predictedPrice = await runPythonScript(details);

//     res.json({
//       success: true,
//       valuation: predictedPrice   // số tỷ VND
//     });

//   } catch (error) {
//     console.error('Valuation error:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Lỗi khi định giá bằng AI',
//       error: error.message   // gửi chi tiết lỗi về frontend để debug
//     });
//   }
// });

export { 
  getProperties, 
  getFeaturedProperties, 
  getPropertyById, 
  getValuation 
};