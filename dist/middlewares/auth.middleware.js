import jwt from "jsonwebtoken";
import { ApiError } from "../utils/AppError.js";
export const protectRoutes = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError("Unauthorized: Missing or malformed token", 401));
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return next(new ApiError("Unauthorized: Token missing", 401));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
        req.user = {
            _id: decoded._id,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new ApiError("Unauthorized: Invalid or expired token", 401));
        }
        next(error);
    }
};
//# sourceMappingURL=auth.middleware.js.map