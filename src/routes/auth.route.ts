import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validation.middleware.js";
import {
  loginSchema,
  verifyEmailSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from "../validations/user.validation.js";

const authRoutes = Router();

authRoutes.post("/login", validate(loginSchema), authController.login.bind(authController));
authRoutes.post("/verify-email", validate(verifyEmailSchema), authController.verifyEmail.bind(authController));
authRoutes.get("/verify-email", authController.verifyEmailFromLink.bind(authController));
authRoutes.post("/resend-otp", validate(resendOtpSchema), authController.resendOtp.bind(authController));
authRoutes.get("/resend-otp", authController.resendOtpFromLink.bind(authController));
authRoutes.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword.bind(authController));
authRoutes.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword.bind(authController));
authRoutes.post("/refresh-token", validate(refreshTokenSchema), authController.refreshToken.bind(authController));

export default authRoutes;