import asyncHandler from "express-async-handler";
import AuthService from "../service/auth.service.js";
import { uploadImage, deleteImage } from "../service/image.service.js";
import User from "../models/UserModel.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const result = await AuthService.register({ name, email, phone: phone || '', password });
  res.status(201).json({
    success: true,
    message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực OTP.",
    data: result,
  });
});

export const verifyRegistrationOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await AuthService.verifyRegistrationOtp({ email, otp });
  res.status(200).json({
    success: true,
    message: "Xác thực thành công. Đăng ký hoàn tất.",
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthService.login({ email, password });
  res.json({
    success: true,
    message: "Đăng nhập thành công",
    data: result,
  });
});

export const requestPasswordChange = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.userId;
  const result = await AuthService.requestPasswordChange({ userId, newPassword });
  res.json({
    success: true,
    message: "Mã OTP đã được gửi đến email của bạn",
    data: result,
  });
});

export const verifyPasswordChangeOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;
  const result = await AuthService.verifyPasswordChangeOtp({ userId, otp });
  res.json({
    success: true,
    message: "Mật khẩu đã được thay đổi thành công",
    data: result,
  });
});

export const requestNameChange = asyncHandler(async (req, res) => {
  const { newName } = req.body;
  const userId = req.userId;
  const result = await AuthService.requestNameChange({ userId, newName });
  res.json({
    success: true,
    message: "Mã OTP đã được gửi đến email của bạn",
    data: result,
  });
});

export const verifyNameChangeOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;
  const result = await AuthService.verifyNameChangeOtp({ userId, otp });
  res.json({
    success: true,
    message: "Tên đã được thay đổi thành công",
    data: result,
  });
});

export const requestEmailChange = asyncHandler(async (req, res) => {
  const { newEmail } = req.body;
  const userId = req.userId;
  const result = await AuthService.requestEmailChange({ userId, newEmail });
  res.json({
    success: true,
    message: "Mã OTP đã được gửi đến email mới của bạn",
    data: result,
  });
});

export const verifyEmailChangeOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;
  const result = await AuthService.verifyEmailChangeOtp({ userId, otp });
  res.json({
    success: true,
    message: "Email đã được thay đổi thành công",
    data: result,
  });
});

export const requestPhoneChange = asyncHandler(async (req, res) => {
  const { newPhone } = req.body;
  const userId = req.userId;
  const result = await AuthService.requestPhoneChange({ userId, newPhone });
  res.json({
    success: true,
    message: "Mã OTP đã được gửi đến email của bạn",
    data: result,
  });
});

export const verifyPhoneChangeOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;
  const result = await AuthService.verifyPhoneChangeOtp({ userId, otp });
  res.json({
    success: true,
    message: "Số điện thoại đã được thay đổi thành công",
    data: result,
  });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      message: "Không có file được upload" 
    });
  }

  const userId = req.userId;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: "User không tồn tại" 
    });
  }

  // Xóa avatar cũ nếu có
  if (user.avatar && user.avatar.publicId) {
    try {
      await deleteImage(user.avatar.publicId);
    } catch (error) {
      console.error("Error deleting old avatar:", error);
    }
  }

  // Upload avatar mới với kích thước tối ưu
  const uploadResult = await uploadImage(req.file.buffer, {
    folder: "real-estate/avatars",
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  });

  // Cập nhật avatar trong database với cấu trúc mới
  user.avatarUrl = uploadResult.secure_url;
  user.avatarPublicId = uploadResult.public_id;
  await user.save();

  // Then return:
  res.json({
    success: true,
    data: {
      avatar: {
        url: user.avatarUrl,
        publicId: user.avatarPublicId,
      }
    }
  });
});

export const softDeleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const adminId = req.userId;

  // Check if user making request is admin
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền thực hiện hành động này",
    });
  }

  // Check if target user exists
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: "Người dùng không tồn tại",
    });
  }

  // Prevent admin from soft-deleting themselves
  if (adminId === userId) {
    return res.status(400).json({
      success: false,
      message: "Không thể xóa tài khoản của chính mình",
    });
  }

  // Soft delete: set isActive to false
  targetUser.isActive = false;
  await targetUser.save();

  res.json({
    success: true,
    message: "Tài khoản người dùng đã bị vô hiệu hóa thành công",
    data: {
      userId: targetUser._id,
      isActive: targetUser.isActive,
    },
  });
});

