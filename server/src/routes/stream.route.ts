import { createStream, endStream } from "src/controllers/stream.controller";
import { Router } from "express";
import { verifyJWT } from "src/middlewares/auth.middleware";

const router = Router();

router.post("/create-stream", verifyJWT, createStream);
router.delete("/end-stream/:streamId", verifyJWT, endStream);

export default router;
