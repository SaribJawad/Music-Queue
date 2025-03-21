import mongoose, { Schema } from "mongoose";
const tempCodeModel = new Schema({
    code: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    },
});
export const TempCode = mongoose.model("TempCode", tempCodeModel);
