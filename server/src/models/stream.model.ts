import mongoose, { Schema } from "mongoose";
import { ISong } from "./song.model";
import { IUser } from "./user.model";

type StreamTypes = "youtube" | "soundcloud";

export interface IStream extends Document {
  streamType: StreamTypes;
  owner: IUser;
  songQueue: ISong[];
  currentSong: ISong;
}

const streamSchema: Schema<IStream> = new Schema(
  {
    streamType: {
      type: String,
      enum: ["youtube", "soundcloud"],
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    songQueue: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Song",
      },
    ],
    currentSong: {
      type: mongoose.Types.ObjectId,
      ref: "Song",
    },
  },
  { timestamps: true }
);

export const Stream = mongoose.model("Stream", streamSchema);
