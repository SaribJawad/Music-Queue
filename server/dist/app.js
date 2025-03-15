import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport-setup.js";
import http from "http";
const app = express();
app.use(helmet());
app.use(cors({
    // origin: process.env.CLIENT_URL || "http://localhost:3000",
    origin: ["https://sync-sphere-eight.vercel.app", "http://localhost:5173"],
    credentials: true, // Allow cookies & auth headers
    allowedHeaders: ["Content-Type", "Authorization"], // Explicitly allow headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
//  routes
import authRouter from "./routes/auth.route.js";
import roomRouter from "./routes/room.route.js";
// import songRouter from "./routes/song.route";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import WebSocketService from "./websocket/WebSocketService.js";
//  routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/room", roomRouter);
app.use(errorHandler);
// websocket implementation
const server = http.createServer(app);
new WebSocketService(server);
export { server };
