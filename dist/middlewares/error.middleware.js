import { ApiError } from "../utils/AppError.js";
const errorMiddleware = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    }
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }
    if (err.code === 11000) {
        statusCode = 409;
        message = "Duplicate field value entered";
    }
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
export default errorMiddleware;
//# sourceMappingURL=error.middleware.js.map