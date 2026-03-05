import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (fileBuffer, options = {}) => {
  const defaultOptions = {
    folder: "real-estate",
    resource_type: "image",
    transformation: [
      { width: 1200, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  };

  const uploadOptions = {
    ...defaultOptions,
    ...options,
    transformation: options.transformation || defaultOptions.transformation,
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    stream.end(fileBuffer);
  });
};

export const deleteImage = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};