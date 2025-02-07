import { Router } from "express";
import {
  addSong,
  downVoteSong,
  upVoteSong,
} from "src/controllers/song.controller";
import { verifyJWT } from "src/middlewares/auth.middleware";

const router = Router();

router.post("/add-song", verifyJWT, addSong);
router.post("/upvote-song/:songId", verifyJWT, upVoteSong);
router.post("/downvote-song/:songId", verifyJWT, downVoteSong);

export default router;
