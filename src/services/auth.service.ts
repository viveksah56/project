import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import { ApiError } from "../utils/AppError.js";
import { otpGenerator } from "../utils/helper.js";
import emailService from "./email.service.js";
import { env } from "../config/env.js";
import type { IUser } from "../models/user.model.js";
import type {
  IRefreshTokenInput,
  IResetPasswordInput,
  IResendOtpInput,
  IForgotPasswordInput,
  ILoginInput,
  IVerifyEmailInput,
} from "../validations/user.validation.js";

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResult {
  user: IUser;
  tokens: IAuthTokens;
}

const OTP_EXPIRY_MS = 10 * 60 * 1000;

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const generateTokens = (userId: string): IAuthTokens => {
  return {
    accessToken: jwt.sign({ id: userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions),
    refreshToken: jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as jwt.SignOptions),
  };
};

const saveOtp = async (email: string, otp: string): Promise<void> => {
  const hashedOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
  await Otp.deleteMany({ email });
  await Otp.create({ email, otp: hashedOtp, expiresAt });
};

const validateOtp = async (email: string, otp: string): Promise<void> => {
  const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

  if (!otpRecord) {
    throw new ApiError("OTP not found or expired", 400);
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteMany({ email });
    throw new ApiError("OTP has expired. Please request a new one", 400);
  }

  const isValid = await bcrypt.compare(otp, otpRecord.otp);
  if (!isValid) {
    throw new ApiError("Invalid OTP", 400);
  }

  await Otp.deleteMany({ email });
};

class AuthService {
  async loginWithGoogle(idToken: string): Promise<IAuthResult> {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new ApiError("Invalid Google token", 401);
    }

    const { email, name, picture, sub } = payload;

    if (!email || !name) {
      throw new ApiError("Google account missing required fields", 400);
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        ...(picture && { avatar: picture }),
        password: `GOOGLE_${sub}`,
        isVerified: true,
        role: "user" as const,
      });
    }

    if (!user.isVerified) {
      await User.findByIdAndUpdate(user._id, { isVerified: true });
      user.isVerified = true;
    }

    return { user, tokens: generateTokens(String(user._id)) };
  }

  async login(input: ILoginInput): Promise<IAuthResult> {
    const user = await User.findOne({ email: input.email }).select("+password");

    if (!user) {
      throw new ApiError("Invalid email or password", 401);
    }

    if (!user.isVerified) {
      throw new ApiError("Please verify your email before logging in", 403);
    }

    const isPasswordValid = await user.comparePassword(input.password);
    if (!isPasswordValid) {
      throw new ApiError("Invalid email or password", 401);
    }

    return { user, tokens: generateTokens(String(user._id)) };
  }

  async verifyEmail(input: IVerifyEmailInput): Promise<{ message: string }> {
    const user = await User.findOne({ email: input.email });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    if (user.isVerified) {
      throw new ApiError("Email already verified", 400);
    }

    await validateOtp(input.email, input.otp);
    await User.findOneAndUpdate({ email: input.email }, { isVerified: true });

    return { message: "Email verified successfully" };
  }

  async resendOtp(input: IResendOtpInput): Promise<{ message: string }> {
    const user = await User.findOne({ email: input.email });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    if (user.isVerified) {
      throw new ApiError("Email already verified", 400);
    }

    const otp = otpGenerator(6);
    await saveOtp(input.email, otp);
    await emailService.sendOtpEmail(input.email, otp);

    return { message: "OTP resent successfully" };
  }

  async forgotPassword(input: IForgotPasswordInput): Promise<{ message: string }> {
    const user = await User.findOne({ email: input.email });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const otp = otpGenerator(6);
    await saveOtp(input.email, otp);
    await emailService.sendOtpEmail(input.email, otp);

    return { message: "OTP sent to your email" };
  }

  async resetPassword(input: IResetPasswordInput): Promise<{ message: string }> {
    const user = await User.findOne({ email: input.email });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    await validateOtp(input.email, input.otp);

    const hashed = await bcrypt.hash(input.newPassword, 10);
    await User.findOneAndUpdate({ email: input.email }, { password: hashed });

    return { message: "Password reset successfully" };
  }

  async refreshToken(input: IRefreshTokenInput): Promise<IAuthTokens> {
    let decoded: { id: string };

    try {
      decoded = jwt.verify(input.refreshToken, env.JWT_REFRESH_SECRET) as { id: string };
    } catch {
      throw new ApiError("Invalid or expired refresh token", 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    return generateTokens(String(user._id));
  }
}

const authService = new AuthService();
export default authService;