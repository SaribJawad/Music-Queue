import { Router } from "express";
import passport from "passport";
import {
  getUserInfo,
  handelGoogleLogout,
  handleGoogleLogin,
} from "src/controllers/auth.controller";
import { verifyJWT } from "src/middlewares/auth.middleware";

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
router.get("/google/logout", verifyJWT, handelGoogleLogout);
router.get("/get-user", verifyJWT, getUserInfo);

export default router;
