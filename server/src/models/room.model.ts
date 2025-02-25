import mongoose, { Schema } from "mongoose";
import { ISong } from "./song.model";
import { IUser } from "./user.model";

type RoomTypes = "youtube" | "soundcloud";

export interface IRoom extends Document {
  roomType: RoomTypes;
  roomName: string;
  roomPassword: string;
  owner: IUser;
  songQueue: ISong[];
  currentSong: ISong | null;
}

const roomSchema: Schema<IRoom> = new Schema(
  {
    roomType: {
      type: String,
      enum: ["youtube", "soundcloud"],
      required: true,
    },
    roomName: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomPassword: {
      type: String,
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
      default: null,
    },
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", roomSchema);
