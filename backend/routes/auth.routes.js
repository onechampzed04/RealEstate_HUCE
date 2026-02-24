import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { 
  register, 
  verifyRegistrationOtp,
  login,
  requestPasswordChange,
  verifyPasswordChangeOtp,
  requestNameChange,
  verifyNameChangeOtp,
  requestEmailChange,
  verifyEmailChangeOtp,
  requestPhoneChange,
  verifyPhoneChangeOtp
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validateMiddlware.js";
import { registerSchema, loginSchema } from "../validator/auth.validator.js";

const router = express.Router();

// Public endpoints
router.post("/register", validate(registerSchema), register);
router.post("/verify-registration-otp", verifyRegistrationOtp);
router.post("/login", validate(loginSchema), login);

// Protected endpoints - Password change
router.post("/request-password-change", authenticate, requestPasswordChange);
router.post("/verify-password-change", authenticate, verifyPasswordChangeOtp);

// Protected endpoints - Name change
router.post("/request-name-change", authenticate, requestNameChange);
router.post("/verify-name-change", authenticate, verifyNameChangeOtp);

// Protected endpoints - Email change
router.post("/request-email-change", authenticate, requestEmailChange);
router.post("/verify-email-change", authenticate, verifyEmailChangeOtp);

// Protected endpoints - Phone change
router.post("/request-phone-change", authenticate, requestPhoneChange);
router.post("/verify-phone-change", authenticate, verifyPhoneChangeOtp);

// Protected endpoints - User profile
router.get("/profile", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

export default router;
