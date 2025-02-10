import {
  clearSongQueue,
  createStream,
  endStream,
  getAllStreams,
  getSongQueue,
  getStream,
  playNextSong,
  removeSongFromQueue,
} from "src/controllers/stream.controller";
import { Router } from "express";
import { verifyJWT } from "src/middlewares/auth.middleware";

const router = Router();

router.get("/get-all-streams", verifyJWT, getAllStreams);
router.post("/create-stream", verifyJWT, createStream);
router
  .route("/:streamId")
  .get(verifyJWT, getStream)
  .delete(verifyJWT, endStream)
  .patch(verifyJWT, clearSongQueue);
router.get("/song-queue/:streamId", verifyJWT, getSongQueue);
router.post("/play-next/:streamId", verifyJWT, playNextSong);
router.post(
  "/remove-song-from-queue/:streamId/:songId",
  verifyJWT,
  removeSongFromQueue
);

export default router;
