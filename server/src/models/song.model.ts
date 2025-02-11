import mongoose, { Schema } from "mongoose";
import { IStream } from "./stream.model";

type Source = "youtube" | "soundcloud";

export interface ISong extends Document {
  externalId: string;
  title: string;
  duration: number;
  coverImageUrl: string;
  source: Source;
  vote: string[];
  noOfVote: number;
  addedBy: string;
  stream: IStream;
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
    duration: {
      type: Number,
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

    stream: {
      type: mongoose.Types.ObjectId,
      ref: "Stream",
    },
  },
  {
    timestamps: true,
  }
);

export const Song = mongoose.model("Song", songSchema);
