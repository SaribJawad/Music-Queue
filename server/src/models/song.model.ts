import mongoose, { Schema } from "mongoose";
import { IRoom } from "./room.model";

type Source = "youtube" | "soundcloud";

export interface ISong extends Document {
  externalId: string;
  title: string;
  coverImageUrl: string;
  source: Source;
  vote: string[];
  noOfVote: number;
  room: IRoom;
  artist: string;
}

const songSchema: Schema<ISong> = new Schema(
  {
    externalId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
      requried: true,
    },
    artist: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ["youtube", "soundcloud"],
      required: true,
    },
    vote: [
      {
        type: String,
        required: true,
        default: [],
      },
    ],
    noOfVote: {
      type: Number,
      default: 0,
    },

    room: {
      type: mongoose.Types.ObjectId,
      ref: "Stream",
    },
  },
  {
    timestamps: true,
  }
);

export const Song = mongoose.model("Song", songSchema);
