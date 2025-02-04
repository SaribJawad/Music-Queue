class ApiError extends Error {
  statusCode: number;
  success: false;
  errors: string[];
  data: null;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors = []
  ) {
    super(message);
    this.errors = errors;
    this.data = null;
    this.statusCode = statusCode;
    this.success = false;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export { ApiError };
