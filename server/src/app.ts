import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport-setup";
import http from "http";
import { handleAddSong } from "./ws-handlers/handleAddSong";
import { WebSocket, WebSocketServer } from "ws";

const app: Express = express();

app.use(helmet());

app.use(
  cors({
    // origin: process.env.CLIENT_URL || "http://localhost:3000",
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ### routes

import authRouter from "./routes/auth.route";
import streamRouter from "./routes/stream.route";
import songRouter from "./routes/song.route";
import errorHandler from "./middlewares/errorHandler.middler";

// ### routes declaration

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/stream", streamRouter);
app.use("/api/v1/song", songRouter);

app.use(errorHandler as express.ErrorRequestHandler);

// ### websocket implementation
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const rooms = new Map<string, Set<WebSocket>>();

wss.on("connection", (ws, req) => {
  let currentRoom: string | null;

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message.toString());

      console.log("Received message:", data);

      if (data.action === "join") {
        const streamId = data.streamId;
        if (!streamId) return;

        // Leave previous room if switching
        if (currentRoom && rooms.has(currentRoom)) {
          rooms.get(currentRoom)?.delete(ws);
        }

        // Join new room
        currentRoom = streamId;
        if (!rooms.has(streamId)) {
          rooms.set(streamId, new Set());
        }
        rooms.get(streamId)?.add(ws);

        console.log(
          `Client joined room: ${streamId}, Total users: ${
            rooms.get(streamId)?.size
          }`
        );

        return;
      }

      if (data.action === "addSong") {
        handleAddSong({ currentRoom: currentRoom, data: data, rooms: rooms });
      }

      if (currentRoom && rooms.has(currentRoom)) {
        rooms.get(currentRoom)?.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            console.log(data, "sending");
            client.send(JSON.stringify(data));
          }
        });
      }
    } catch (error) {
      console.error("Error parsing message:", error);
      ws.send("error", error);
    }
  });

  console.log("connected");

  ws.on("close", () => {
    if (currentRoom && rooms.has(currentRoom)) {
      rooms.get(currentRoom)?.delete(ws);

      // Remove room if empty
      if (rooms.get(currentRoom)?.size === 0) {
        rooms.delete(currentRoom);
      }
    }
    console.log("Client disconnected");
  });
});

export { server };
