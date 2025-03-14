import mongoose, { Schema } from "mongoose";
const songSchema = new Schema({
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
    vote: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    noOfVote: {
        type: Number,
        default: 0,
    },
    room: {
        type: mongoose.Types.ObjectId,
        ref: "Stream",
    },
}, {
    timestamps: true,
});
export const Song = mongoose.model("Song", songSchema);
