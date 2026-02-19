import { uploadImage } from "../service/image.service.js";

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const results = [];

    for (const file of req.files) {
      const result = await uploadImage(file.buffer);
      results.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};
