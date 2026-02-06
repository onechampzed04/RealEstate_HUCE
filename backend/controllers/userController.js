
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/UserModel.js';
import userService from '../service/userService.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await userService.loginUser(email, password);

  res.json(result);
});

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const result = await userService.registerUser(name, email, password);

  res.json(result);
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user._id thường được gán bởi middleware bảo vệ (Protect Middleware)
  const result = await userService.getUserProfile(req.user._id);

  res.json(result);
});

export { authUser, registerUser, getUserProfile };
