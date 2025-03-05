import mongoose, { ObjectId, Schema } from "mongoose";
import bcrypt from "bcryptjs";
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
  users: ObjectId[];
  isPasswordCorrect: (inputPassword: string) => Promise<boolean>;
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
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

roomSchema.pre("save", async function (next) {
  if (!this.isModified("roomPassword")) return next();

  this.roomPassword = await bcrypt.hash(this.roomPassword, 10);
  next();
});

roomSchema.methods.isPasswordCorrect = async function (inputPassword: string) {
  return await bcrypt.compare(inputPassword, this.roomPassword);
};

export const Room = mongoose.model("Room", roomSchema);
