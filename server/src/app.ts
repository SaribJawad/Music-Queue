import express, {
  ErrorRequestHandler,
  Express,
  Request,
  Response,
} from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport-setup";

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

export { app };
