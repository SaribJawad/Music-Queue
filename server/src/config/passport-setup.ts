import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // TODO
      //  check user in db
      //  if not create user in db
      console.log(profile);
      return done(null, profile);
    }
  )
);
