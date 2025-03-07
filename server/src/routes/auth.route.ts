import { Router } from "express";
import passport from "passport";
import {
  getUserInfo,
  handelGoogleLogout,
  handleGoogleLogin,
  refreshAcccessToken,
} from "src/controllers/auth.controller";
import { verifyJWT } from "src/middlewares/auth.middleware";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.post("/refresh-token", refreshAcccessToken);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  handleGoogleLogin
);
router.get("/google/logout", verifyJWT, handelGoogleLogout);
router.get("/get-user", verifyJWT, getUserInfo);

export default router;
