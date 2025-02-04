import express, { Express, Request, Response } from "express";
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
    origin: "*",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// routes

import authRouter from "./routes/auth.route";

// routes declaration

app.use("/api/v1/auth", authRouter);

export { app };
