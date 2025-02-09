class ApiError extends Error {
  statusCode: number;
  success: false;
  errors: string[];
  stack?: string;
  data: null;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors = [],
    stack: string = ""
  ) {
    super(message);
    this.errors = errors;
    this.data = null;
    this.statusCode = statusCode;
    this.success = false;

    if (stack) {
      this.stack = process.env.NODE_ENV === "development" ? stack : undefined;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
