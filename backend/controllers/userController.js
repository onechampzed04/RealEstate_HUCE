
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/UserModel.js';
import userService from '../service/userService.js';
import otpStore from '../utils/otpStore.js';
import emailService from '../utils/emailService.js';

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
// Initiate registration: generate OTP and send to email
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = new Error('Please provide name, email, and password');
    error.statusCode = 400;
    throw error;
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  console.log(`[REGISTER] Initiating registration for: ${email}`);
  
  try {
    const otp = otpStore.createPending(name, email, password);
    console.log(`[REGISTER] OTP generated for ${email}: ${otp}`);
    
    await emailService.sendOtpEmail(email, otp);
    console.log(`[REGISTER] OTP sent successfully to ${email}`);

    res.json({ message: 'OTP sent to email', email });
  } catch (err) {
    console.error(`[REGISTER] Error sending OTP to ${email}:`, err.message);
    otpStore.removePending(email); // Clean up on error
    const error = new Error(`Failed to send OTP: ${err.message}`);
    error.statusCode = 500;
    throw error;
  }
});

// Verify OTP and create user
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    const error = new Error('Email and OTP are required');
    error.statusCode = 400;
    throw error;
  }

  console.log(`[VERIFY OTP] Verifying OTP for: ${email}`);
  
  const pending = otpStore.getPending(email);
  if (!pending) {
    console.error(`[VERIFY OTP] No pending registration found for ${email}`);
    const error = new Error('No pending registration or OTP expired');
    error.statusCode = 400;
    throw error;
  }
  
  if (pending.otp !== otp) {
    console.error(`[VERIFY OTP] Wrong OTP for ${email}. Expected: ${pending.otp}, Got: ${otp}`);
    const error = new Error('Invalid OTP');
    error.statusCode = 400;
    throw error;
  }

  console.log(`[VERIFY OTP] OTP verified for ${email}. Creating user...`);

  // Create user
  const result = await userService.createUser(pending.name, pending.email, pending.password);
  otpStore.removePending(email);
  
  console.log(`[VERIFY OTP] User created successfully: ${email}`);
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
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const result = await userService.updateUserProfile(req.user._id, name, email, password);

  res.json(result);
});

export { authUser, registerUser, verifyOtp, getUserProfile, updateUserProfile };
