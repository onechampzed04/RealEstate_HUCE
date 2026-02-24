import asyncHandler from "express-async-handler";
import AuthService from "../service/auth.service.js";

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
  console.log("Login request received with email:", email); // ✅ Debug log
  const result = await AuthService.login({ email, password });
  console.log("Login result:", result); // ✅ Debug log
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
