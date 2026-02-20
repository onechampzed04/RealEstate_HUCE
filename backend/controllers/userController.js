
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

// @desc    Request password change - send OTP to email
// @route   POST /api/users/request-password-change
// @access  Private
const requestPasswordChange = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    const error = new Error('New password is required');
    error.statusCode = 400;
    throw error;
  }

  const userId = req.user._id.toString();
  const userEmail = req.user.email;

  console.log(`[PASSWORD CHANGE] Initiating password change for: ${userEmail}`);

  try {
    const otp = otpStore.createPendingPasswordChange(userId, newPassword);
    console.log(`[PASSWORD CHANGE] OTP generated for ${userEmail}: ${otp}`);

    await emailService.sendOtpEmail(userEmail, otp);
    console.log(`[PASSWORD CHANGE] OTP sent successfully to ${userEmail}`);

    res.json({ message: 'OTP sent to email', email: userEmail });
  } catch (err) {
    console.error(`[PASSWORD CHANGE] Error sending OTP to ${userEmail}:`, err.message);
    otpStore.removePendingPasswordChange(userId);
    const error = new Error(`Failed to send OTP: ${err.message}`);
    error.statusCode = 500;
    throw error;
  }
});

// @desc    Verify password change OTP and update password
// @route   POST /api/users/verify-password-change
// @access  Private
const verifyPasswordChangeOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    const error = new Error('OTP is required');
    error.statusCode = 400;
    throw error;
  }

  const userId = req.user._id.toString();
  const userEmail = req.user.email;

  console.log(`[PASSWORD CHANGE VERIFY] Verifying OTP for: ${userEmail}`);

  const pending = otpStore.getPendingPasswordChange(userId);
  if (!pending) {
    console.error(`[PASSWORD CHANGE VERIFY] No pending password change found for ${userEmail}`);
    const error = new Error('No pending password change or OTP expired');
    error.statusCode = 400;
    throw error;
  }

  if (pending.otp !== otp) {
    console.error(`[PASSWORD CHANGE VERIFY] Wrong OTP for ${userEmail}. Expected: ${pending.otp}, Got: ${otp}`);
    const error = new Error('Invalid OTP');
    error.statusCode = 400;
    throw error;
  }

  console.log(`[PASSWORD CHANGE VERIFY] OTP verified for ${userEmail}. Updating password...`);

  // Change password
  const result = await userService.changePasswordAfterOtp(userId, pending.newPassword);
  otpStore.removePendingPasswordChange(userId);

  console.log(`[PASSWORD CHANGE VERIFY] Password changed successfully for: ${userEmail}`);
  res.json(result);
});

// @desc    Request name change - send OTP to email
// @route   POST /api/users/request-name-change
// @access  Private
const requestNameChange = asyncHandler(async (req, res) => {
  const { newName } = req.body;

  if (!newName) {
    const error = new Error('New name is required');
    error.statusCode = 400;
    throw error;
  }

  const userId = req.user._id.toString();
  const userEmail = req.user.email;

  console.log(`[NAME CHANGE] Initiating name change for: ${userEmail}`);

  try {
    const otp = otpStore.createPendingNameChange(userId, newName);
    console.log(`[NAME CHANGE] OTP generated for ${userEmail}: ${otp}`);

    await emailService.sendOtpEmail(userEmail, otp);
    console.log(`[NAME CHANGE] OTP sent successfully to ${userEmail}`);

    res.json({ message: 'OTP sent to email', email: userEmail });
  } catch (err) {
    console.error(`[NAME CHANGE] Error sending OTP to ${userEmail}:`, err.message);
    otpStore.removePendingNameChange(userId);
    const error = new Error(`Failed to send OTP: ${err.message}`);
    error.statusCode = 500;
    throw error;
  }
});

// @desc    Verify name change OTP and update name
// @route   POST /api/users/verify-name-change
// @access  Private
const verifyNameChangeOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    const error = new Error('OTP is required');
    error.statusCode = 400;
    throw error;
  }

  const userId = req.user._id.toString();
  const userEmail = req.user.email;

  console.log(`[NAME CHANGE VERIFY] Verifying OTP for: ${userEmail}`);

  const pending = otpStore.getPendingNameChange(userId);
  if (!pending) {
    console.error(`[NAME CHANGE VERIFY] No pending name change found for ${userEmail}`);
    const error = new Error('No pending name change or OTP expired');
    error.statusCode = 400;
    throw error;
  }

  if (pending.otp !== otp) {
    console.error(`[NAME CHANGE VERIFY] Wrong OTP for ${userEmail}. Expected: ${pending.otp}, Got: ${otp}`);
    const error = new Error('Invalid OTP');
    error.statusCode = 400;
    throw error;
  }

  console.log(`[NAME CHANGE VERIFY] OTP verified for ${userEmail}. Updating name...`);

  // Change name
  const result = await userService.changeNameAfterOtp(userId, pending.newName);
  otpStore.removePendingNameChange(userId);

  console.log(`[NAME CHANGE VERIFY] Name changed successfully for: ${userEmail}`);
  res.json(result);
});

// @desc    Request email change - send OTP to current email
// @route   POST /api/users/request-email-change
// @access  Private
const requestEmailChange = asyncHandler(async (req, res) => {
  const { newEmail } = req.body;

  if (!newEmail) {
    const error = new Error('New email is required');
    error.statusCode = 400;
    throw error;
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email: newEmail });
  if (existingUser) {
    const error = new Error('Email already in use');
    error.statusCode = 400;
    throw error;
  }

  const userId = req.user._id.toString();
  const userEmail = req.user.email;

  console.log(`[EMAIL CHANGE] Initiating email change for: ${userEmail} -> ${newEmail}`);

  try {
    const otp = otpStore.createPendingEmailChange(userId, newEmail);
    console.log(`[EMAIL CHANGE] OTP generated for ${userEmail}: ${otp}`);

    await emailService.sendOtpEmail(newEmail, otp);
    console.log(`[EMAIL CHANGE] OTP sent successfully to ${newEmail}`);

    res.json({ message: 'OTP sent to email', email: newEmail });
  } catch (err) {
    console.error(`[EMAIL CHANGE] Error sending OTP to ${newEmail}:`, err.message);
    otpStore.removePendingEmailChange(userId);
    const error = new Error(`Failed to send OTP: ${err.message}`);
    error.statusCode = 500;
    throw error;
  }
});

// @desc    Verify email change OTP and update email
// @route   POST /api/users/verify-email-change
// @access  Private
const verifyEmailChangeOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    const error = new Error('OTP is required');
    error.statusCode = 400;
    throw error;
  }

  const userId = req.user._id.toString();
  const userEmail = req.user.email;

  console.log(`[EMAIL CHANGE VERIFY] Verifying OTP for: ${userEmail}`);

  const pending = otpStore.getPendingEmailChange(userId);
  if (!pending) {
    console.error(`[EMAIL CHANGE VERIFY] No pending email change found for ${userEmail}`);
    const error = new Error('No pending email change or OTP expired');
    error.statusCode = 400;
    throw error;
  }

  if (pending.otp !== otp) {
    console.error(`[EMAIL CHANGE VERIFY] Wrong OTP for ${userEmail}. Expected: ${pending.otp}, Got: ${otp}`);
    const error = new Error('Invalid OTP');
    error.statusCode = 400;
    throw error;
  }

  console.log(`[EMAIL CHANGE VERIFY] OTP verified for ${userEmail}. Updating email...`);

  // Change email
  const result = await userService.changeEmailAfterOtp(userId, pending.newEmail);
  otpStore.removePendingEmailChange(userId);

  console.log(`[EMAIL CHANGE VERIFY] Email changed successfully for: ${userEmail}`);
  res.json(result);
});

export { authUser, registerUser, verifyOtp, getUserProfile, updateUserProfile, requestPasswordChange, verifyPasswordChangeOtp, requestNameChange, verifyNameChangeOtp, requestEmailChange, verifyEmailChangeOtp };
