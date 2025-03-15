import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./config.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://music-queue.onrender.com/api/v1/auth/google/callback"
          : "http://localhost:3000/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const {
        _json: { name, email, picture: avatar, sub: googleId },
      } = profile;

      const user = await User.findOne({ email });

      if (!user) {
        await User.create({
          name,
          email,
          avatar,
          googleId,
        });
      } else if (!user.googleId) {
        throw new ApiError(
          409,
          "This email is already registered with password authentication. Please login with your password."
        );
      }
      return done(null, profile);
    }
  )
);
