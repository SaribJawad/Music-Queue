import { Song } from "src/models/song.model";
import { asyncHandler } from "src/utils/asyncHandler";
import { ApiResponse } from "src/utils/ApiResponse";
import { ApiError } from "src/utils/ApiError";
import { z } from "zod";
import { Stream } from "src/models/stream.model";
import { IUser } from "src/models/user.model";
import mongoose from "mongoose";

const addSongSchema = z.object({
  externalId: z.string().min(1, "External ID is required"),
  title: z.string().min(1, "Title is required"),
  duration: z.number().min(1, "Duration must be greater than 0"),
  coverImageUrl: z.string().url("Invalid cover image URL"),
  source: z.enum(["soundcloud", "youtube"]),
  addedBy: z.string().min(1, "Added by is required"),
  stream: z.string().min(1, "Stream ID is required"),
});

const addSong = asyncHandler(async (req, res) => {
  try {
    const validatedData = addSongSchema.parse(req.body);

    const song = await Song.create({ ...validatedData });

    const updatedStream = await Stream.findByIdAndUpdate(
      validatedData.stream,
      {
        $push: { songQueue: song },
      },
      { new: true }
    );

    if (!updatedStream) {
      throw new ApiError(
        400,
        "Something went wrong while adding strong the stream"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(201, song, "Added song successfully"));
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(
        400,
        error.errors.map((err) => err.message).join(", ")
      );
    }
    throw new ApiError(400, "Something went wrong while adding song");
  }
});

const upVoteSong = asyncHandler(async (req, res) => {
  const { songId } = req.params;
  const { _id: userId } = req.user as IUser;

  if (!mongoose.isValidObjectId(songId)) {
    throw new ApiError(400, "Invalid song ID");
  }

  const song = await Song.findById(songId);

  if (!song) {
    throw new ApiError(404, "Song not found");
  }

  if (song.vote.includes(userId)) {
    return res.status(200).json(new ApiResponse(200, {}, "Already upvoted"));
  }

  await Song.findByIdAndUpdate(songId, {
    $addToSet: { vote: userId },
    $inc: { noOfVote: 1 },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Song upvoted successfully"));
});

const downVoteSong = asyncHandler(async (req, res) => {
  const { songId } = req.params;
  const { _id: userId } = req.user as IUser;

  if (!mongoose.isValidObjectId(songId)) {
    throw new ApiError(400, "Invalid song ID");
  }

  const song = await Song.findById(songId);

  if (!song) {
    throw new ApiError(404, "Song not found");
  }

  if (!song.vote.includes(userId)) {
    return res.status(200).json(new ApiResponse(200, {}, "Already downvoted"));
  }

  await Song.findByIdAndUpdate(songId, {
    $addToSet: { vote: userId },
    $inc: {
      noOfVote: -1,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Song downvoted successfully"));
});

export { addSong, upVoteSong, downVoteSong };
