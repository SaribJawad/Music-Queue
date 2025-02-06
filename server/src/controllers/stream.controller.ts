import mongoose, { isValidObjectId } from "mongoose";
import { IStream, Stream } from "src/models/stream.model";
import { asyncHandler } from "src/utils/asyncHandler";
import { ApiResponse } from "src/utils/ApiResponse";
import { ApiError } from "src/utils/ApiError";
import { IUser } from "src/models/user.model";
import { ISong, Song } from "src/models/song.model";

const createStream = asyncHandler(async (req, res) => {
  const { streamType } = req.body;

  if (!streamType) {
    throw new ApiError(400, "Stream type is required");
  }

  if (!req.user) {
    throw new ApiError(401, "Unauthorized access");
  }

  const { _id: userId } = req.user as IUser;

  const stream = await Stream.create({
    streamType,
    owner: userId,
  });

  if (!stream) {
    throw new ApiError(500, "Something went wrong while creating stream");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, stream, "Stream created successfully"));
});

const getStream = asyncHandler(async (req, res) => {
  const { streamId } = req.params;

  if (!mongoose.isValidObjectId(streamId)) {
    throw new ApiError(400, "Invalid stream Id");
  }

  const stream = await Stream.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(streamId),
      },
    },
    {
      $lookup: {
        from: "songs",
        localField: "songQueue",
        foreignField: "_id",
        as: "songQueue",
      },
    },
    {
      $project: {
        songQueue: 1,
        owner: 1,
        streamType: 1,
        currentSong: 1,
      },
    },
  ]);

  if (!stream) {
    throw new ApiError(404, "Stream not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, stream[0], "Stream fetch successfully"));
});

const endStream = asyncHandler(async (req, res) => {
  const { streamId } = req.params;

  if (!mongoose.isValidObjectId(streamId)) {
    throw new ApiError(400, "Invalid Stream ID");
  }

  const stream = await Stream.findById(streamId);

  if (!stream) {
    throw new ApiError(400, "Stream not found");
  }

  if (stream.songQueue.length > 0) {
    await Song.deleteMany({ _id: { $in: stream.songQueue } });
  }

  await Stream.findByIdAndDelete(streamId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Stream ended successfully"));
});

const getSongQueue = asyncHandler(async (req, res) => {
  const { streamId } = req.params;

  if (!mongoose.isValidObjectId(streamId)) {
    throw new ApiError(400, "Invalid stream ID");
  }

  const stream = await Stream.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(streamId),
      },
    },
    {
      $lookup: {
        from: "songs",
        localField: "songQueue",
        foreignField: "_id",
        as: "songQueue",
      },
    },
    {
      $addFields: {
        songQueue: {
          $sortArray: {
            input: "$songQueue",
            sortBy: { noOfVote: -1 },
          },
        },
      },
    },
    {
      $project: {
        songQueue: 1,
      },
    },
  ]);

  if (!stream.length) {
    throw new ApiError(404, "Stream not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stream[0].songQueue,
        "Song queue fetched successfully"
      )
    );
});

const clearSongQueue = asyncHandler(async (req, res) => {
  const { streamId } = req.params;

  if (!mongoose.isValidObjectId(streamId)) {
    throw new ApiError(400, "Invalide stream ID");
  }

  const stream = await Stream.findById(streamId);

  if (!stream) {
    throw new ApiError(400, "Stream not found");
  }

  await Song.deleteMany({ _id: { $in: stream.songQueue } });

  return res
    .status(200)
    .json(new ApiResponse(200, stream, "Cleared song queue successfully"));
});

const playNextSong = asyncHandler(async (req, res) => {
  const { streamId } = req.params;

  if (!mongoose.isValidObjectId(streamId)) {
    throw new ApiError(400, "Invalid stream ID");
  }

  const streamData = await Stream.aggregate([
    {
      $match: {
        _id: streamId,
      },
    },
    {
      $lookup: {
        from: "songs",
        localField: "songQueue",
        foreignField: "_id",
        as: "songQueue",
      },
    },
    {
      $project: {
        songQueue: 1,
        owner: 1,
        currentSong: 1,
        streamType: 1,
      },
    },
  ]);

  if (!streamData) {
    throw new ApiError(400, "Stream not found");
  }

  const stream = streamData[0];

  if (!stream) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No songs currently in queue"));
  }

  const sortedQueue = stream.songQueue.sort(
    (a: ISong, b: ISong) => b.noOfVote - a.noOfVote
  );

  const nextSong = sortedQueue[0];

  await Song.findByIdAndUpdate(streamId, {
    currentSong: nextSong,
    $pull: { vote: stream._id },
  });

  return res
    .status(201)
    .json(new ApiResponse(200, nextSong, "Next song is playing"));
});

const removeSongFromQueue = asyncHandler(async (req, res) => {
  const { streamId } = req.params;
  const { songId } = req.body;

  if (!mongoose.isValidObjectId(streamId)) {
    throw new ApiError(400, "Invalid stream ID");
  }

  if (!mongoose.isValidObjectId(songId)) {
    throw new ApiError(400, "Invalid song ID");
  }

  const stream = await Stream.findByIdAndUpdate(
    streamId,
    {
      $pull: { songQueue: songId },
    },
    { new: true }
  );

  if (!stream) {
    throw new ApiError(404, "Stream not found");
  }

  const songExists = stream.songQueue.includes(songId);
  if (songExists) {
    await Song.findByIdAndDelete(songId);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, stream, "Song removed from queue"));
});

export {
  createStream,
  endStream,
  clearSongQueue,
  playNextSong,
  removeSongFromQueue,
  getStream,
  getSongQueue,
};
