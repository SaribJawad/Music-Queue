import { Types } from "mongoose";
import { Profile } from "passport-google-oauth20";
import { User } from "src/models/user.model";
import { ApiError } from "src/utils/ApiError";
import { ApiResponse } from "src/utils/ApiResponse";
import { asyncHandler } from "src/utils/asyncHandler";

const generateAccessAndRefreshToken = async (
  userId: Types.ObjectId
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();

    user.refreshToken = refreshToken;
    user?.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const handleGoogleLogin = asyncHandler(async (req, res) => {
  const { id: googleId } = req.user as Profile;

  const user = await User.findOne({ googleId }).select("-refreshToken");

  if (!user) {
    throw new ApiError(401, "Authentication failed");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    // sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Logged in successfully"));
});

const handelGoogleLogout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

export { handleGoogleLogin, handelGoogleLogout };
