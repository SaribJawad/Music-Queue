class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
        super(message);
        this.errors = errors;
        this.data = null;
        this.statusCode = statusCode;
        this.success = false;
        if (stack) {
            this.stack = process.env.NODE_ENV === "development" ? stack : undefined;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { ApiError };
