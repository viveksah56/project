import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/AppError.js";

interface IDecodedToken {
    _id: string;
    email: string;
    role: string;
}

export const protectRoutes = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError("Unauthorized: Missing or malformed token", 401));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return next(new ApiError("Unauthorized: Token missing", 401));
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "fallback_secret"
        ) as IDecodedToken;

        req.user = {
            _id: decoded._id,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new ApiError("Unauthorized: Invalid or expired token", 401));
        }
        next(error);
    }
};