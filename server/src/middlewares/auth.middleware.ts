import { ApiError } from "src/utils/ApiError";
import { asyncHandler } from "src/utils/asyncHandler";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "src/config/config";
import { User } from "src/models/user.model";

interface JwtPayload extends jwt.JwtPayload {
  _id: string;
  googleId?: string;
  email: string;
  name: string;
}

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const accessToken =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      accessToken,
      ACCESS_TOKEN_SECRET!
    ) as JwtPayload;

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized error");
  }
});

export { verifyJWT };
