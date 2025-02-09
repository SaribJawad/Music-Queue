import mongoose, { Types } from "mongoose";
import { Profile } from "passport-google-oauth20";
import { IUser, User } from "src/models/user.model";
import { ApiError } from "src/utils/ApiError";
import { ApiResponse } from "src/utils/ApiResponse";
import { asyncHandler } from "src/utils/asyncHandler";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "src/config/config";

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
    new mongoose.Types.ObjectId(user._id)
  );

  const options = {
    httpOnly: true,
    // sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  return res.redirect("http://localhost:5173/auth");
});

const handelGoogleLogout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const getUserInfo = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user as IUser;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id");
  }

  const user = await User.findById(userId).select("-refreshToken");

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User info fetched succesfully"));
});

export { handleGoogleLogin, handelGoogleLogout, getUserInfo };
