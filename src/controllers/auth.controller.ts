import type { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service.js";
import { ApiError } from "../utils/AppError.js";
import { setAuthCookies, clearAuthCookies } from "../middlewares/auth.middleware.js";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken, result.role);
      res.status(200).json({ success: true, message: "Logged in successfully" });
    } catch (error) {
      next(error);
    }
  }

  async loginWithGoogle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        res.status(400).json({ success: false, message: "Google ID token is required" });
        return;
      }
      const result = await authService.loginWithGoogle(idToken);
      setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken, result.role);
      res.status(200).json({ success: true, message: "Google login successful" });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      clearAuthCookies(res);
      res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getLoggedUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new ApiError("Unauthorized", 401);
      const user = await authService.getLoggedUser(req.user._id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!token) throw new ApiError("Refresh token missing", 401);
      const result = await authService.refreshToken({ refreshToken: token });
      setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken, result.role);
      res.status(200).json({ success: true, message: "Token refreshed successfully" });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.verifyEmail(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmailFromLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.query as { email: string; otp: string };
      if (!email || !otp) {
        res.status(400).json({ success: false, message: "Email and OTP are required" });
        return;
      }
      const result = await authService.verifyEmail({ email, otp });
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.resendOtp(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async resendOtpFromLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.query as { email: string };
      if (!email) {
        res.status(400).json({ success: false, message: "Email is required" });
        return;
      }
      const result = await authService.resendOtp({ email });
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.forgotPassword(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.resetPassword(req.body);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();
export default authController;