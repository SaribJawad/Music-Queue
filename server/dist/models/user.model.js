import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, } from "src/config/config";
const userSchema = new Schema({
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
}, { timestamps: true });
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        googleId: this.googleId || "",
        email: this.email,
        name: this.name,
    }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
        googleId: this.googleId || "",
        name: this.name,
        email: this.email,
    }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
};
export const User = mongoose.model("User", userSchema);
