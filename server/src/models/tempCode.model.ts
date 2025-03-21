import mongoose, { ObjectId, Schema } from "mongoose";

export interface ITempCode {
  code: string;
  token: string;
  userId: ObjectId;
  createdAt: Date;
}

const tempCodeModel: Schema<ITempCode> = new Schema({
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
