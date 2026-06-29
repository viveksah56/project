import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),

  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string({ message: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters"),

  role: z.enum(["user", "admin"]).default("user").optional(),

  avatar: z.string().url("Invalid avatar URL").optional(),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim()
    .optional(),

  email: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .optional(),

  avatar: z.string().url("Invalid avatar URL").optional(),

  role: z.enum(["user", "admin"]).optional(),

  isVerified: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),

  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string({ message: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters"),

  role: z.enum(["user", "admin"]).default("user").optional(),

  avatar: z.string().url("Invalid avatar URL").optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),

  otp: z
    .string({ message: "OTP is required" })
    .length(6, "OTP must be 6 digits"),
});

export const resendOtpSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),

  otp: z
    .string({ message: "OTP is required" })
    .length(6, "OTP must be 6 digits"),

  newPassword: z
    .string({ message: "New password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string({ message: "Refresh token is required" })
    .min(1, "Refresh token is required"),
});

export type ICreateUserInput = z.infer<typeof createUserSchema>;
export type IUpdateUserInput = z.infer<typeof updateUserSchema>;
export type IRegisterInput = z.infer<typeof registerSchema>;
export type ILoginInput = z.infer<typeof loginSchema>;
export type IVerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type IResendOtpInput = z.infer<typeof resendOtpSchema>;
export type IForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type IResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type IRefreshTokenInput = z.infer<typeof refreshTokenSchema>;