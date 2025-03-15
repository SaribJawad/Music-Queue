import mongoose, { ObjectId, Schema } from "mongoose";
import { IRoom } from "./room.model.js";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from "@/config/config";

export interface IUser extends Document {
  _id: ObjectId;
  googleId: string;
  name: string;
  email: string;
  avatar?: string;
  rooms: IRoom[];
  isAlive: boolean;
  isJoined: { status: boolean; roomId: ObjectId | null };
  temporarilyDisconnected: boolean;
  disconnectedAt: Date | null;
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
    rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
    isJoined: {
      status: { type: Boolean, required: true, default: false },
      roomId: { type: Schema.Types.ObjectId, ref: "Room", default: null },
    },
    refreshToken: { type: String },
    isAlive: { type: Boolean, default: false, required: true },
    temporarilyDisconnected: { type: Boolean, default: false },
    disconnectedAt: {
      type: Date,
      default: null,
    },
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
