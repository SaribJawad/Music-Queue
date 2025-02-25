import {
  clearSongQueue,
  endRoom,
  getAllRooms,
  getSongQueue,
  getRoom,
  playNextSong,
  removeSongFromQueue,
} from "src/controllers/room.controller";
import { Router } from "express";
import { verifyJWT } from "src/middlewares/auth.middleware";

const router = Router();

// router.post("/create-room", verifyJWT, createRoom);
router.get("/get-all-rooms", verifyJWT, getAllRooms);
router
  .route("/:roomId")
  .get(verifyJWT, getRoom)
  .delete(verifyJWT, endRoom)
  .patch(verifyJWT, clearSongQueue);
router.get("/song-queue/:roomId", verifyJWT, getSongQueue);
router.post("/play-next/:roomId", verifyJWT, playNextSong);
router.post(
  "/remove-song-from-queue/:roomId/:songId",
  verifyJWT,
  removeSongFromQueue
);

export default router;
