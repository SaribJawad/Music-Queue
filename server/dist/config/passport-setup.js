var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./config.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://music-queue.onrender.com/api/v1/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const { _json: { name, email, picture: avatar, sub: googleId }, } = profile;
    const user = yield User.findOne({ email });
    if (!user) {
        yield User.create({
            name,
            email,
            avatar,
            googleId,
        });
    }
    else if (!user.googleId) {
        throw new ApiError(409, "This email is already registered with password authentication. Please login with your password.");
    }
    return done(null, profile);
})));
