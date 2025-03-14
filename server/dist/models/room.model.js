var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
const roomSchema = new Schema({
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
}, { timestamps: true });
roomSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("roomPassword"))
            return next();
        this.roomPassword = yield bcrypt.hash(this.roomPassword, 10);
        next();
    });
});
roomSchema.methods.isPasswordCorrect = function (inputPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(inputPassword, this.roomPassword);
    });
};
export const Room = mongoose.model("Room", roomSchema);
