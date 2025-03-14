import { getAllRooms, getSongQueue, getRoom, } from "src/controllers/room.controller.js";
import { Router } from "express";
import { verifyJWT } from "src/middlewares/auth.middleware.js";
const router = Router();
// router.post("/create-room", verifyJWT, createRoom);
router.get("/get-all-rooms", verifyJWT, getAllRooms);
router.route("/:roomId").get(verifyJWT, getRoom);
router.get("/song-queue/:roomId", verifyJWT, getSongQueue);
export default router;
