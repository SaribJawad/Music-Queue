import { ApiError } from "../utils/ApiError.js";
const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
    }
    return res.status(500).json({
        success: false,
        message: "An unexpected error occurred.",
    });
};
export default errorHandler;
