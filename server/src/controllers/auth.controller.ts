import { Profile } from "passport-google-oauth20";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
import mongoose from "mongoose";
import { IUser, User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  FRONTEND_URL,
  NODE_ENV,
  PROD_FRONTEND_URL,
  REFRESH_TOKEN_SECRET,
} from "../config/config.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Room } from "../models/room.model.js";
import { TempCode } from "@/models/tempCode.model.js";

const generateAccessAndRefreshToken = async (
  userId: ObjectId
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

const refreshAcccessToken = asyncHandler(async (req, res) => {
  const incomingRequestToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRequestToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      String(incomingRequestToken),
      REFRESH_TOKEN_SECRET!
    );

    const user = await User.findById((decodedToken as jwt.JwtPayload)._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .clearCookie("refreshToken", options)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Refresh token expired, please login again");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid refresh token, please login again");
    } else {
      throw new ApiError(500, "Something went wrong while refreshing token");
    }
  }
});

const handleGoogleLogin = asyncHandler(async (req, res) => {
  const { id: googleId } = req.user as Profile;
  const user = await User.findOne({ googleId }).select("-refreshToken");

  if (!user) {
    throw new ApiError(401, "Authentication failed");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    secure: isProduction,
    partitioned: true,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  //   const code = uuidv4();

  //   const createdTempCode = await TempCode.create({
  //     code,
  //     token: accessToken,
  //     userId: user._id,
  //     createdAt: new Date(),
  //   });

  //   console.log(createdTempCode)

  const redirectUrl =
    NODE_ENV === "development"
      ? `${FRONTEND_URL}/room`
      : `${PROD_FRONTEND_URL}/room`;

  return res.redirect("https://sync-sphere-eight.vercel.app/room");
});

const handelGoogleLogout = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user as IUser;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  try {
    await Room.deleteMany({ owner: userId });
  } catch (error) {
    throw new ApiError(500, "Something went wrong while deleting the room");
  }

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

  const user = await User.findById(userId).select(
    "-refreshToken -createdAt -updatedAt -__v -temporarilyDisconnected -disconnectedAt"
  );

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User info fetched succesfully"));
});

export {
  handleGoogleLogin,
  handelGoogleLogout,
  getUserInfo,
  refreshAcccessToken,
};
