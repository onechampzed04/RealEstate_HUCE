
import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  verifyOtp,
  getUserProfile,
  updateUserProfile,
  requestPasswordChange,
  verifyPasswordChangeOtp,
  requestNameChange,
  verifyNameChangeOtp,
  requestEmailChange,
  verifyEmailChangeOtp
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/register').post(registerUser);
router.route('/verify-otp').post(verifyOtp);
router.post('/login', authUser);
router.post('/request-password-change', protect, requestPasswordChange);
router.post('/verify-password-change', protect, verifyPasswordChangeOtp);
router.post('/request-name-change', protect, requestNameChange);
router.post('/verify-name-change', protect, verifyNameChangeOtp);
router.post('/request-email-change', protect, requestEmailChange);
router.post('/verify-email-change', protect, verifyEmailChangeOtp);
router.put('/profile/edit', protect, updateUserProfile);
router.route('/profile').get(protect, getUserProfile);

export default router;
