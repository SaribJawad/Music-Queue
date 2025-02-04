import mongoose, { Schema } from "mongoose";
import { Stream } from "./stream.model";

export interface IUser extends Document {
  name: string;
  email: string;
  avatar?: string;
  streams: Stream[];
}

const userMongooseSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
    streams: [{ type: Schema.Types.ObjectId, ref: "Stream" }],
  },
  { timestamps: true }
);

export const user = mongoose.model<IUser>("User", userMongooseSchema);
