import mongoose, { isValidObjectId } from "mongoose";
import { IRoom, Room } from "src/models/room.model";
import { asyncHandler } from "src/utils/asyncHandler";
import { ApiResponse } from "src/utils/ApiResponse";
import { ApiError } from "src/utils/ApiError";
import { IUser, User } from "src/models/user.model";
import { ISong, Song } from "src/models/song.model";

const getAllRooms = asyncHandler(async (req, res) => {
  try {
    const rooms = await Room.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "owner",
          as: "owner",
        },
      },
      {
        $addFields: {
          owner: { $first: "$owner" },
        },
      },
      {
        $project: {
          _id: 1,
          roomType: 1,
          roomName: 1,
          owner: {
            _id: 1,
            name: 1,
            email: 1,
            avatar: 1,
          },
          users: 1,
        },
      },
    ]);
    if (rooms.length <= 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, rooms, "No rooms found"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, rooms, "Rooms fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while fetching rooms");
  }
});

const getRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "Invalid room Id");
  }

  const room = await Room.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(roomId),
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
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $lookup: {
        from: "songs",
        localField: "currentSong",
        foreignField: "_id",
        as: "currentSong",
      },
    },

    {
      $addFields: {
        owner: { $first: "$owner" },
        currentSong: {
          $ifNull: [{ $first: "$currentSong" }, null],
        },
      },
    },
    {
      $project: {
        roomName: 1,
        roomType: 1,
        owner: {
          _id: 1,
          name: 1,
          avatar: 1,
          email: 1,
        },
        streamType: 1,
        currentSong: 1,
        users: 1,
      },
    },
  ]);

  if (!room[0]) {
    throw new ApiError(404, "Room not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, room[0], "Room fetch successfully"));
});

const endRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { _id: userId } = req.user as IUser;

  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "Invalid Room ID");
  }

  const room = await Room.findById(roomId);

  if (!room) {
    throw new ApiError(400, "Room not found");
  }

  if (room.songQueue.length > 0) {
    await Song.deleteMany({ _id: { $in: room.songQueue } });
  }

  await Room.findByIdAndDelete(roomId);

  await User.findByIdAndUpdate(userId, {
    isAlive: false,
    $pull: { streams: roomId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Room ended successfully"));
});

const clearSongQueue = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "Invalide room ID");
  }

  const room = await Room.findById(roomId);

  if (!room) {
    throw new ApiError(400, "Room not found");
  }

  await Song.deleteMany({ _id: { $in: room.songQueue } });

  return res
    .status(200)
    .json(new ApiResponse(200, room, "Cleared song queue successfully"));
});

const getSongQueue = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "Invalid room ID");
  }

  const room = await Room.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(roomId),
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
        songQueue: {
          externalId: 1,
          title: 1,
          coverImageUrl: 1,
          artist: 1,
          source: 1,
          vote: 1,
          noOfVote: 1,
          room: 1,
          _id: 1,
        },
      },
    },
  ]);

  if (!room.length) {
    throw new ApiError(404, "Room not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, room[0].songQueue, "Song queue fetched successfully")
    );
});

const playNextSong = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "Invalid room ID");
  }

  const roomData = await Room.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(roomId),
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

  if (!roomData[0]) {
    throw new ApiError(400, "Room not found");
  }

  const room = roomData[0];
  if (!room) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No songs currently in queue"));
  }

  const sortedQueue = room.songQueue.sort(
    (a: ISong, b: ISong) => b.noOfVote - a.noOfVote
  );

  const nextSong = sortedQueue[0];

  await Room.findByIdAndUpdate(roomId, {
    currentSong: nextSong,
    $pull: { songQueue: nextSong._id },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, nextSong, "Next song is playing"));
});

const removeSongFromQueue = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { songId } = req.body;

  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "Invalid room ID");
  }

  if (!mongoose.isValidObjectId(songId)) {
    throw new ApiError(400, "Invalid song ID");
  }

  const room = await Room.findByIdAndUpdate(
    roomId,
    {
      $pull: { songQueue: songId },
    },
    { new: true }
  );

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  const songExists = room.songQueue.includes(songId);
  if (songExists) {
    await Song.findByIdAndDelete(songId);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, room, "Song removed from queue"));
});

export {
  //   createRoom,
  endRoom,
  clearSongQueue,
  playNextSong,
  removeSongFromQueue,
  getRoom,
  getSongQueue,
  getAllRooms,
};
