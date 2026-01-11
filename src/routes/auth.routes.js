import express from "express";
import {
  registerController,
  loginController,
  getUserById,
  logoutController,
  countUserController,
  verifyEmailController,
  resendOTPController,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/verify-email", verifyEmailController);
router.post("/resend-otp", resendOTPController);
router.post("/login", loginController);
router.get("/data", authMiddleware, getUserById);
router.delete("/logout", authMiddleware, logoutController);
router.get("/user/count", authMiddleware, countUserController);

export default router;
