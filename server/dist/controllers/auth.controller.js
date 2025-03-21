var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { FRONTEND_URL, NODE_ENV, PROD_FRONTEND_URL, REFRESH_TOKEN_SECRET, } from "../config/config.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Room } from "../models/room.model.js";
const generateAccessAndRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const accessToken = user === null || user === void 0 ? void 0 : user.generateAccessToken();
        const refreshToken = user === null || user === void 0 ? void 0 : user.generateRefreshToken();
        user.refreshToken = refreshToken;
        user === null || user === void 0 ? void 0 : user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
});
const refreshAcccessToken = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const incomingRequestToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRequestToken) {
        throw new ApiError(401, "Unauthorized request");
    }
    try {
        const decodedToken = jwt.verify(String(incomingRequestToken), REFRESH_TOKEN_SECRET);
        const user = yield User.findById(decodedToken._id);
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        };
        const { accessToken, refreshToken } = yield generateAccessAndRefreshToken(user._id);
        return res
            .status(200)
            .clearCookie("refreshToken", options)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new ApiError(401, "Refresh token expired, please login again");
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, "Invalid refresh token, please login again");
        }
        else {
            throw new ApiError(500, "Something went wrong while refreshing token");
        }
    }
}));
const handleGoogleLogin = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: googleId } = req.user;
    const user = yield User.findOne({ googleId }).select("-refreshToken");
    if (!user) {
        throw new ApiError(401, "Authentication failed");
    }
    const { accessToken, refreshToken } = yield generateAccessAndRefreshToken(user._id);
    const isProduction = process.env.NODE_ENV === "production";
    const options = {
        httpOnly: true,
        secure: isProduction,
        // secure: true,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);
    const redirectUrl = NODE_ENV === "development"
        ? `${FRONTEND_URL}/room`
        : `${PROD_FRONTEND_URL}/room`;
    console.log(redirectUrl, "redirectUrl");
    return res.redirect("https://sync-sphere-eight.vercel.app/room");
}));
const handelGoogleLogout = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: userId } = req.user;
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }
    try {
        yield Room.deleteMany({ owner: userId });
    }
    catch (error) {
        throw new ApiError(500, "Something went wrong while deleting the room");
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
}));
const getUserInfo = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: userId } = req.user;
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }
    const user = yield User.findById(userId).select("-refreshToken -createdAt -updatedAt -__v -temporarilyDisconnected -disconnectedAt");
    if (!user) {
        throw new ApiError(401, "User not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User info fetched succesfully"));
}));
export { handleGoogleLogin, handelGoogleLogout, getUserInfo, refreshAcccessToken, };
