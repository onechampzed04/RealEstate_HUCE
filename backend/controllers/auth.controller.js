import asyncHandler from "express-async-handler";
import AuthService from "../service/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const result = await AuthService.register({ name, email, phone, password });
  res.status(201).json({
    success: true,
    message: "Đăng ký thành công",
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
