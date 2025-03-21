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
import { Room } from "../models/room.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { extractedSongSchema, } from "../schema/songSchemas.js";
import { CreateRoomSchema, JoinRoomSchema, RefreshJoinRoomSchema, } from "../schema/roomSchemas.js";
import { ApiError } from "../utils/ApiError.js";
import { extractYouTubeID } from "../utils/extractYoutubeId.js";
import { WebSocket } from "ws";
// @ts-ignore
import youtubesearchapi from "youtube-search-api";
import { z } from "zod";
const objectIdRegex = /^[a-f\d]{24}$/i;
const RoomPayLoadSchema = CreateRoomSchema.extend({
    ws: z.instanceof(WebSocket),
    userId: z.string().regex(objectIdRegex, "Invalid MongoDB ObjectID"),
});
const JoinRoomPayloadSchema = JoinRoomSchema.extend({
    ws: z.instanceof(WebSocket),
    userId: z.string().regex(objectIdRegex, "Invalid MongoDB ObjectID"),
});
const RefreshJoinRoomPayloadSchema = RefreshJoinRoomSchema.extend({
    ws: z.instanceof(WebSocket),
    userId: z.string().regex(objectIdRegex),
});
const LeaveRoomPayloadSchema = z.object({
    userId: z.string().regex(objectIdRegex),
    roomId: z.string().regex(objectIdRegex),
});
const TimestampsPayloadSchema = LeaveRoomPayloadSchema.extend({
    username: z.string(),
    timestamps: z.number(),
});
class RoomService {
    static createRoom(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const room = yield Room.create({
                    roomType: payload.roomType,
                    roomName: payload.roomName,
                    roomPassword: payload.roomPassword,
                    owner: payload.userId,
                });
                const updatedRoom = yield Room.aggregate([
                    {
                        $match: {
                            _id: room._id,
                        },
                    },
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
                            users: 1,
                            currentSong: 1,
                            owner: {
                                _id: 1,
                                name: 1,
                                email: 1,
                                avatar: 1,
                            },
                        },
                    },
                ]);
                if (!updatedRoom) {
                    throw new ApiError(500, "Something went wrong while creating room");
                }
                yield User.findByIdAndUpdate(payload.userId, {
                    isAlive: true,
                    $push: { rooms: room._id },
                }, { new: true });
                RoomService.rooms.set(String(room._id), {
                    users: new Set(),
                    roomName: payload.roomName,
                    roomPassword: payload.roomPassword,
                    ownerWs: payload.ws,
                    userTimestamps: new Map(),
                    roomType: payload.roomType,
                });
                (_a = RoomService.rooms.get(String(room._id))) === null || _a === void 0 ? void 0 : _a.users.add(payload.ws);
                return updatedRoom[0];
            }
            catch (error) {
                const errMessage = error instanceof Error ? error.message : "Failed to create room";
                throw new Error(errMessage);
            }
        });
    }
    static addSong(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { roomId, songUrl } = payload;
                const room = yield Room.findById(roomId);
                console.log("ROOM FOUND", room);
                if (!room) {
                    throw new ApiError(404, "Room not found");
                }
                const roomUsers = (_a = this.rooms.get(String(room._id))) === null || _a === void 0 ? void 0 : _a.users;
                const extractedId = extractYouTubeID(songUrl);
                console.log("EXTRACTED YOUTUBE ID", extractedId);
                const { id, title, channel, thumbnail: { thumbnails }, } = yield youtubesearchapi.GetVideoDetails(extractedId);
                console.log("SONG DATA", id, title, channel, thumbnails);
                const validatedData = extractedSongSchema.parse({
                    externalId: id,
                    title,
                    source: room.roomType,
                    artist: channel,
                    coverImageUrl: thumbnails[thumbnails.length - 1].url,
                    room: roomId,
                });
                console.log("PARSED VALIDATED DATA SONG", validatedData);
                const song = yield Song.create(validatedData);
                const filteredSong = yield Song.findById(song._id)
                    .select("-createdAt -updatedAt -__v")
                    .lean();
                let updateQuery;
                if (!room.currentSong && room.songQueue.length === 0) {
                    updateQuery = { currentSong: filteredSong };
                }
                else {
                    updateQuery = { $push: { songQueue: filteredSong } };
                }
                yield Room.findByIdAndUpdate(roomId, updateQuery, {
                    new: true,
                });
                return { filteredSong, roomUsers };
            }
            catch (error) {
                const errMessage = error instanceof Error ? error.message : "Failed to create room";
                throw new Error(errMessage);
            }
        });
    }
    static joinRoom(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomId, roomPassword, userId, ws } = payload;
                const room = yield Room.findById(roomId);
                const user = yield User.findById(userId);
                if (!user) {
                    throw new ApiError(404, "User not found");
                }
                if (!room) {
                    throw new ApiError(404, "Room not found");
                }
                const activeRoomSession = this.rooms.get(roomId);
                if (!activeRoomSession) {
                    throw new ApiError(404, "Room not found in active sessions");
                }
                const isValidPassword = yield room.isPasswordCorrect(roomPassword);
                if (!isValidPassword) {
                    throw new ApiError(401, "Invalid password");
                }
                room.users.push(userId);
                yield room.save({ validateBeforeSave: false });
                user.isJoined = {
                    status: true,
                    roomId: roomId,
                };
                yield user.save({ validateBeforeSave: false });
                activeRoomSession.users.add(ws);
                activeRoomSession === null || activeRoomSession === void 0 ? void 0 : activeRoomSession.userTimestamps.set(userId, {
                    timestamps: 0,
                    username: user.name,
                });
                // Set up disconnect handler for the WebSocket
                ws.on("close", () => {
                    console.log(`WebSocket disconnected from room ${roomId}`);
                    activeRoomSession.users.delete(ws);
                });
                const joinedUsers = room.users.filter((user) => user.toString() !== room.owner.toString());
                return {
                    userName: user === null || user === void 0 ? void 0 : user.name,
                    roomId: room._id,
                    connectedClients: activeRoomSession.users,
                    ownerWs: activeRoomSession.ownerWs,
                };
            }
            catch (error) {
                const errMessage = error instanceof Error ? error.message : "Failed to join room";
                throw new Error(errMessage);
            }
        });
    }
    static refreshJoinRoom(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, userId, ws } = payload;
            if (!mongoose.isValidObjectId(roomId)) {
                throw new ApiError(400, "Invalid Room ID");
            }
            const room = yield Room.findById(roomId);
            if (!room) {
                throw new ApiError(404, "Room not found");
            }
            const roomIdString = String(room._id);
            if (!this.rooms.has(roomIdString)) {
                this.rooms.set(roomIdString, {
                    users: new Set(),
                    roomName: room.roomName,
                    roomPassword: room.roomPassword,
                    roomType: room.roomType,
                    userTimestamps: new Map(),
                    ownerWs: undefined,
                });
            }
            const activeSessionRoom = this.rooms.get(roomIdString);
            if (String(room.owner) === userId) {
                if ((activeSessionRoom === null || activeSessionRoom === void 0 ? void 0 : activeSessionRoom.ownerWs) !== ws) {
                    activeSessionRoom.ownerWs = ws;
                    activeSessionRoom.users.add(ws);
                }
            }
            else if (room.users.some((user) => user.toString() === userId && !activeSessionRoom.users.has(ws))) {
                activeSessionRoom === null || activeSessionRoom === void 0 ? void 0 : activeSessionRoom.users.add(ws);
            }
            ws.on("close", () => {
                activeSessionRoom.users.delete(ws);
                return;
            });
            return {
                noOfJoinedUsers: activeSessionRoom.users.size,
                connectedClients: activeSessionRoom.users,
            };
        });
    }
    static leaveRoom(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomId, userId } = payload;
                if (!mongoose.isValidObjectId(roomId)) {
                    throw new ApiError(400, "Invalid Room ID");
                }
                const room = yield Room.findById(roomId);
                const user = yield User.findById(userId);
                const activeRoomSession = this.rooms.get(roomId);
                if (!room) {
                    throw new ApiError(404, "Room not found");
                }
                if (!user) {
                    throw new ApiError(401, "Invalid userId");
                }
                yield Room.updateOne({ _id: roomId }, { $pull: { users: userId } });
                const updatedUser = yield User.findByIdAndUpdate(userId, {
                    isJoined: {
                        status: false,
                        roomId: null,
                    },
                }, { new: true });
                if (!updatedUser) {
                    throw new ApiError(500, "Something went wrong while updating room");
                }
                activeRoomSession === null || activeRoomSession === void 0 ? void 0 : activeRoomSession.userTimestamps.delete(userId);
                return {
                    username: updatedUser.name,
                    connectedClient: activeRoomSession === null || activeRoomSession === void 0 ? void 0 : activeRoomSession.users,
                };
            }
            catch (error) {
                const errMessage = error instanceof Error ? error.message : "Failed to join room";
                throw new Error(errMessage);
            }
        });
    }
    static endRoom(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { roomId, userId } = payload;
                if (!mongoose.isValidObjectId(roomId)) {
                    throw new ApiError(400, "Invalid Room ID");
                }
                const room = yield Room.findById(roomId);
                const user = yield User.findById(userId);
                const activeRoomSession = this.rooms.get(roomId);
                if (!room) {
                    throw new ApiError(404, "Room not found");
                }
                if (!user) {
                    throw new ApiError(401, "Invalid userId");
                }
                if (((_a = room.songQueue) === null || _a === void 0 ? void 0 : _a.length) >= 1) {
                    yield Song.deleteMany({ _id: { $in: room.songQueue } });
                }
                if (room.currentSong) {
                    yield Song.findByIdAndDelete(room.currentSong);
                }
                yield User.findByIdAndUpdate(userId, {
                    isAlive: false,
                    $pull: { rooms: roomId },
                }, { new: true });
                yield Room.findByIdAndDelete(roomId);
                if ((_b = room.users) === null || _b === void 0 ? void 0 : _b.length) {
                    yield User.updateMany({ _id: { $in: room.users } }, {
                        $set: {
                            "isJoined.status": false,
                            "isJoined.roomId": null,
                        },
                    });
                }
                return {
                    connectedClients: activeRoomSession === null || activeRoomSession === void 0 ? void 0 : activeRoomSession.users,
                };
            }
            catch (error) {
                const errMessage = error instanceof Error ? error.message : "Failed to join room";
                throw new Error(errMessage);
            }
        });
    }
    static deleteSong(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomId, songId } = payload;
                if (!mongoose.isValidObjectId(roomId)) {
                    throw new ApiError(400, "Invalid Room ID");
                }
                if (!mongoose.isValidObjectId(songId)) {
                    throw new ApiError(400, "Invalid Song ID");
                }
                const room = yield Room.findByIdAndUpdate(roomId, {
                    $pull: { songQueue: songId },
                }, {
                    new: true,
                });
                if (!room) {
                    throw new ApiError(500, "Something went wrong while updating room");
                }
                const activeRoomSession = this.rooms.get(roomId);
                yield Song.findByIdAndDelete(songId);
                return { connectedClients: activeRoomSession === null || activeRoomSession === void 0 ? void 0 : activeRoomSession.users };
            }
            catch (error) {
                const errMessage = error instanceof Error ? error.message : "Failed to join room";
                throw new Error(errMessage);
            }
        });
    }
    static upvoteSong(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, songId, userId } = payload;
            if (!mongoose.isValidObjectId(roomId)) {
                throw new ApiError(400, "Invalid Room ID");
            }
            if (!mongoose.isValidObjectId(songId)) {
                throw new ApiError(400, "Invalid Song ID");
            }
            const room = yield Room.findById(roomId);
            if (!room) {
                throw new ApiError(404, "Room not found");
            }
            const activeRoomSession = this.rooms.get(roomId);
            const song = yield Song.findById(songId);
            if (!song) {
                throw new ApiError(404, "Song not found");
            }
            if (song.vote.some((voteId) => String(voteId) === userId)) {
                song.vote = song.vote.filter((voteId) => String(voteId) !== userId);
                song.noOfVote = song.noOfVote - 1;
                yield song.save({ validateBeforeSave: false });
            }
            else {
                song.vote = [...song.vote, new mongoose.Types.ObjectId(userId)];
                song.noOfVote = song.noOfVote + 1;
                yield song.save({ validateBeforeSave: false });
            }
            return {
                connectedClients: activeRoomSession === null || activeRoomSession === void 0 ? void 0 : activeRoomSession.users,
                userId,
            };
        });
    }
    static playNextSong(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomId, songId } = payload;
                if (!mongoose.isValidObjectId(roomId)) {
                    throw new ApiError(400, "Invalid Room ID");
                }
                if (!mongoose.isValidObjectId(songId)) {
                    throw new ApiError(400, "Invalid Song ID");
                }
                const room = yield Room.findById(roomId);
                const nextSong = yield Song.findById(songId).select("-createdAt -updatedAt");
                if (!room) {
                    throw new ApiError(404, "Room not found");
                }
                if (!nextSong) {
                    throw new ApiError(404, "Song not found");
                }
                const activeSessionRoom = this.rooms.get(roomId);
                yield Song.findByIdAndDelete(room.currentSong);
                room.currentSong = nextSong;
                room.songQueue = room.songQueue.filter((song) => String(song) !== songId);
                yield room.save({ validateBeforeSave: false });
                return { song: nextSong, connectedClients: activeSessionRoom === null || activeSessionRoom === void 0 ? void 0 : activeSessionRoom.users };
            }
            catch (error) {
                const errMessage = error instanceof Error ? error.message : "Failed to join room";
                throw new Error(errMessage);
            }
        });
    }
    static timestamps(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomId, timestamps, userId, username } = payload;
                const activeRoomSession = this.rooms.get(roomId);
                if (!activeRoomSession)
                    return;
                if (userId && activeRoomSession.userTimestamps.has(userId)) {
                    const userTimestamp = activeRoomSession.userTimestamps.get(userId);
                    userTimestamp.timestamps = timestamps;
                    userTimestamp.username = username;
                }
                return {
                    ownerWs: activeRoomSession.ownerWs,
                    username,
                    timestamps,
                };
            }
            catch (error) {
                const errMessage = error instanceof Error ? error.message : "Failed to join room";
                throw new Error(errMessage);
            }
        });
    }
}
RoomService.rooms = new Map();
export default RoomService;
