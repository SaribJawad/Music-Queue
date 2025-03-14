var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import { Room } from "src/models/room.model";
import { asyncHandler } from "src/utils/asyncHandler";
import { ApiResponse } from "src/utils/ApiResponse";
import { ApiError } from "src/utils/ApiError";
const getAllRooms = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield Room.aggregate([
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
    }
    catch (error) {
        throw new ApiError(500, "Something went wrong while fetching rooms");
    }
}));
const getRoom = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    if (!mongoose.isValidObjectId(roomId)) {
        throw new ApiError(400, "Invalid room Id");
    }
    const room = yield Room.aggregate([
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
}));
const getSongQueue = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    if (!mongoose.isValidObjectId(roomId)) {
        throw new ApiError(400, "Invalid room ID");
    }
    const room = yield Room.aggregate([
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
        .json(new ApiResponse(200, room[0].songQueue, "Song queue fetched successfully"));
}));
export { getRoom, getSongQueue, getAllRooms };
