import {
  clearSongQueue,
  createStream,
  endStream,
  getSongQueue,
  getStream,
  playNextSong,
  removeSongFromQueue,
} from "src/controllers/stream.controller";
import { Router } from "express";
import { verifyJWT } from "src/middlewares/auth.middleware";

const router = Router();

router.post("/create-stream", verifyJWT, createStream);
router
  .route("/:streamId")
  .get(verifyJWT, getStream)
  .delete(verifyJWT, endStream)
  .patch(verifyJWT, clearSongQueue);
router.get("/song-queue", verifyJWT, getSongQueue);
router.post("/play-next/:streamId", verifyJWT, playNextSong);
router.post(
  "/remove-song-from-queue/:streamId/:songId",
  verifyJWT,
  removeSongFromQueue
);

export default router;
