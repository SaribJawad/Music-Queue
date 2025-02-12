import { Song } from "src/models/song.model";
import { asyncHandler } from "src/utils/asyncHandler";
import { ApiResponse } from "src/utils/ApiResponse";
import { ApiError } from "src/utils/ApiError";
import { z } from "zod";
import { Stream } from "src/models/stream.model";
import { IUser } from "src/models/user.model";
// @ts-ignore
import youtubesearchapi from "youtube-search-api";
import mongoose from "mongoose";
import { extractYouTubeID } from "src/utils/extractYoutubeId";

const objectIdRegex = /^[a-f\d]{24}$/i;

const addSongSchema = z.object({
  externalId: z.string().min(1, "External ID is required"),
  title: z.string().min(1, "Title is required"),
  coverImageUrl: z.string().url("Invalid cover image URL"),
  artist: z.string(),
  source: z.enum(["soundcloud", "youtube"]),
  stream: z.string().regex(objectIdRegex, "Invalid MongoDB ObjectID"),
});

const addSong = asyncHandler(async (req, res) => {
  const { streamId } = req.params;
  const { url } = req.body;

  try {
    if (!mongoose.isValidObjectId(streamId)) {
      throw new ApiError(400, "Invalid stream ID");
    }

    // TODO add check for youtube and soundcloud
    // Handle add song for souncloud

    const stream = await Stream.findById(streamId);

    if (!stream) {
      throw new ApiError(404, "Stream not found");
    }

    const extractedId = extractYouTubeID(url);

    if (!extractedId) {
      throw new ApiError(400, "Invalid youtube URL");
    }

    const {
      id,
      title,
      channel,
      thumbnail: { thumbnails },
    } = await youtubesearchapi.GetVideoDetails(extractedId);

    const validatedData = addSongSchema.parse({
      externalId: id,
      title,
      source: stream.streamType,
      artist: channel,
      coverImageUrl: thumbnails[thumbnails.length - 1].url,
      stream: streamId,
    });

    const song = await Song.create(validatedData);

    if (!song) {
      throw new ApiError(500, "Something went wrong while adding song");
    }

    let updateQuery;
    if (!stream.currentSong && stream.songQueue.length === 0) {
      updateQuery = { currentSong: song };
    } else {
      updateQuery = { $push: { songQueue: song } };
    }

    const updatedStream = await Stream.findByIdAndUpdate(
      streamId,
      updateQuery,
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
    $pull: { vote: userId },
    $inc: {
      noOfVote: -1,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Song downvoted successfully"));
});

export { addSong, upVoteSong, downVoteSong };
