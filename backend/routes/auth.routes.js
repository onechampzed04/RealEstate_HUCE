import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { register, login } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validateMiddlware.js";
import { registerSchema, loginSchema } from "../validator/auth.validator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/profile", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "User profile",
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
    },
  });
});

export default router;
