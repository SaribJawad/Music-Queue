import { Router } from "express";
import passport from "passport";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    // TODO :
    // create jwt
    // send cookie to FE
    console.log("req.user", req.user);
  }
);

export default router;
