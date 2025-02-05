import { Router } from "express";
import passport from "passport";
import {
  handelGoogleLogout,
  handleGoogleLogin,
} from "src/controllers/auth.controller";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  handleGoogleLogin
);
router.get("/google/logout", handelGoogleLogout);

export default router;
