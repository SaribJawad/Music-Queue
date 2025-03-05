import { Router } from "express";
import { downVoteSong, upVoteSong } from "src/controllers/song.controller";
import { verifyJWT } from "src/middlewares/auth.middleware";

const router = Router();

// router.post("/add-song/:roomId", verifyJWT, addSong);
router.post("/upvote-song/:songId", verifyJWT, upVoteSong);
router.post("/downvote-song/:songId", verifyJWT, downVoteSong);

export default router;
