import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/AppError.js";
import { env } from "../config/env.js";
import User from "../models/user.model.js";

interface IDecodedToken {
  id: string;
}

const isProd = env.NODE_ENV === "production";

const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? ("strict" as const) : ("lax" as const),
};

export const COOKIE_OPTIONS = {
  ...BASE_COOKIE_OPTIONS,
  maxAge: 15 * 60 * 1000,
};

export const REFRESH_COOKIE_OPTIONS = {
  ...BASE_COOKIE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/v1/auth/refresh-token",
};

export const ROLE_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: isProd,
  sameSite: isProd ? ("strict" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
  role: string
): void => {
  res.cookie("_token", accessToken, COOKIE_OPTIONS);
  res.cookie("_refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
  res.cookie("_userRole", role, ROLE_COOKIE_OPTIONS);
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("_token");
  res.clearCookie("_refreshToken", { path: "/api/v1/auth/refresh-token" });
  res.clearCookie("_userRole");
};

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const token =
    req.cookies?._token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return next(new ApiError("Unauthorized", 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as IDecodedToken;
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ApiError("User no longer exists", 401));
    }

    if (!user.isVerified) {
      return next(new ApiError("Please verify your email", 403));
    }

    req.user = {
      _id: String(user._id),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError("Invalid or expired token", 401));
    }
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError("Forbidden: Insufficient permissions", 403));
    }
    next();
  };
};