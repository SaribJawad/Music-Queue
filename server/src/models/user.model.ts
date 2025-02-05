import mongoose, { Schema } from "mongoose";
import { Stream } from "./stream.model";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from "src/config/config";

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  avatar?: string;
  streams: Stream[];
  refreshToken?: string;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    googleId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    streams: [{ type: Schema.Types.ObjectId, ref: "Stream" }],
    refreshToken: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      googleId: this.googleId || "",
      email: this.email,
      name: this.name,
    },
    ACCESS_TOKEN_SECRET!,
    { expiresIn: ACCESS_TOKEN_EXPIRY } as jwt.SignOptions
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      googleId: this.googleId || "",
      name: this.name,
      email: this.email,
    },
    REFRESH_TOKEN_SECRET!,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    } as jwt.SignOptions
  );
};

export const User = mongoose.model<IUser>("User", userSchema);
