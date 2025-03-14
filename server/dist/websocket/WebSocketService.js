var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { WebSocket, WebSocketServer } from "ws";
import { ACCESS_TOKEN_SECRET } from "src/config/config.js";
import { handleCreateRoom, handleEndRoom, handleJoinRoom, handleLeaveRoom, handleRefreshJoinRoom, handleSyncAll, handleTimeStamps, } from "src/handlers/roomHandler.js";
import { handleAddSong, handleDeleteSong, handlePlayNextSong, handleUpVoteSong, } from "src/handlers/songHandler.js";
import { User } from "src/models/user.model.js";
import { Room } from "src/models/room.model.js";
import { Song } from "src/models/song.model.js";
import RoomService from "src/services/RoomService.js";
class WebSocketService {
    constructor(server) {
        this.timeouts = new Map();
        this.wss = new WebSocketServer({ server });
        this.wss.on("connection", this.handleConnection.bind(this));
    }
    handleConnection(ws, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = cookie.parse(req.headers.cookie || "");
            const accessToken = cookies.accessToken || null;
            try {
                const decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
                const id = decodedToken._id;
                ws.userId = id;
                if (this.timeouts.has(id)) {
                    clearTimeout(this.timeouts.get(id));
                    this.timeouts.delete(id);
                }
                yield User.findByIdAndUpdate(id, {
                    temporarilyDisconnected: false,
                    disconnectedAt: null,
                });
                console.log(`User ${id} reconnected, clearing timeout`);
            }
            catch (error) {
                ws.close(4401, "Unauthorized");
                return;
            }
            ws.on("message", (data) => this.handleMessage(ws, data.toString()));
            ws.on("error", console.error);
            ws.on("close", () => this.handleClose(ws));
        });
    }
    handleMessage(ws, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientData = JSON.parse(data);
                switch (clientData.action) {
                    case "CREATE_ROOM":
                        yield handleCreateRoom({ ws, clientData, wsService: this });
                        break;
                    case "ADD_SONG":
                        yield handleAddSong({ ws, clientData, wsService: this });
                        break;
                    case "JOIN_ROOM":
                        yield handleJoinRoom({ ws, clientData, wsService: this });
                        break;
                    case "REFRESH_JOIN_ROOM":
                        yield handleRefreshJoinRoom({ ws, clientData, wsService: this });
                        break;
                    case "LEAVE_ROOM":
                        yield handleLeaveRoom({ ws, clientData, wsService: this });
                        break;
                    case "END_ROOM":
                        yield handleEndRoom({ ws, clientData, wsService: this });
                        break;
                    case "DELETE_SONG":
                        yield handleDeleteSong({ ws, clientData, wsService: this });
                        break;
                    case "UPVOTE_SONG":
                        yield handleUpVoteSong({ ws, clientData, wsService: this });
                        break;
                    case "PLAY_NEXT_SONG":
                        yield handlePlayNextSong({ ws, clientData, wsService: this });
                        break;
                    case "TIMESTAMPS":
                        handleTimeStamps({ ws, clientData, wsService: this });
                        break;
                    case "SYNC_ALL":
                        console.log(clientData.payload);
                        handleSyncAll({ ws, clientData, wsService: this });
                        break;
                    default:
                        break;
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
                this.sendMessage(ws, "ERROR", errorMessage);
            }
        });
    }
    handleClose(ws) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = ws.userId;
            const disconnectTime = Date.now();
            // Check if user is already trying to reconnect
            if (this.timeouts.has(userId)) {
                clearTimeout(this.timeouts.get(userId));
                this.timeouts.delete(userId);
            }
            // temp disconnected
            try {
                yield User.findByIdAndUpdate(userId, {
                    $set: {
                        temporarilyDisconnected: true,
                        disconnectedAt: disconnectTime,
                    },
                }, { new: true });
            }
            catch (error) {
                console.error("Failed to update user disconnection status:", error);
            }
            // const user = await User.findById(userId);
            const timeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                try {
                    const user = yield User.findById(userId);
                    if (!user)
                        return;
                    const isActiveElsewhere = yield this.checkUserActiveInOtherSessions(String(user._id));
                    if (isActiveElsewhere) {
                        user.temporarilyDisconnected = false;
                        user.disconnectedAt = null;
                        yield user.save({ validateBeforeSave: false });
                        return;
                    }
                    if (user === null || user === void 0 ? void 0 : user.isAlive) {
                        const room = yield Room.findById(user.rooms[0]);
                        //   if (!room) {
                        //     throw new ApiError(404, "Room not found");
                        //   }
                        if (!room)
                            return;
                        const activeRoomSession = RoomService.rooms.get(String(room._id));
                        if (((_a = room.songQueue) === null || _a === void 0 ? void 0 : _a.length) >= 1) {
                            yield Song.deleteMany({ _id: { $in: room.songQueue } });
                        }
                        if (room.currentSong) {
                            yield Song.findByIdAndDelete(room.currentSong);
                        }
                        user.isAlive = false;
                        user.rooms = [];
                        yield user.save({ validateBeforeSave: false });
                        yield Room.findByIdAndDelete(room._id);
                        if ((_b = room.users) === null || _b === void 0 ? void 0 : _b.length) {
                            yield User.updateMany({ _id: { $in: room.users } }, {
                                $set: {
                                    "isJoined.status": false,
                                    "isJoined.roomId": null,
                                    temporarilyDisconnected: false,
                                    disconnectedAt: null,
                                },
                            });
                        }
                        activeRoomSession === null || activeRoomSession === void 0 ? void 0 : activeRoomSession.userTimestamps.delete(userId);
                        if (activeRoomSession) {
                            this.sendMessage(ws, "END_ROOM", room._id);
                            this.sendMessageToEveryoneExceptOwnerInRoom(ws, activeRoomSession.users, "ROOM_ENDED", room._id);
                            this.broadcast("REMOVE_ROOM", room._id);
                            RoomService.rooms.delete(String(room._id));
                        }
                    }
                    if (user === null || user === void 0 ? void 0 : user.isJoined.status) {
                        const room = yield Room.findOne({ users: user._id });
                        //   if (!room) {
                        //     throw new ApiError(404, "Room not found");
                        //   }
                        if (!room)
                            return;
                        const activeRoomSession = RoomService.rooms.get(String(room._id));
                        const connectedClients = activeRoomSession === null || activeRoomSession === void 0 ? void 0 : activeRoomSession.users;
                        yield Room.updateOne({ _id: room._id }, { $pull: { users: user._id } });
                        user.isJoined = { status: false, roomId: null };
                        user.temporarilyDisconnected = false;
                        user.disconnectedAt = null;
                        yield user.save({ validateBeforeSave: false });
                        if (activeRoomSession) {
                            this.sendMessageToEveryoneExpectSenderInRoom(ws, connectedClients, "LEFT_ROOM", {
                                message: `${user.name} left the room`,
                                noOfJoinedUsers: connectedClients === null || connectedClients === void 0 ? void 0 : connectedClients.size,
                            });
                            this.sendMessage(ws, "LEAVE_ROOM", `${user.name} left the room`);
                            (_c = RoomService.rooms.get(String(room._id))) === null || _c === void 0 ? void 0 : _c.users.delete(ws);
                        }
                    }
                }
                catch (error) {
                    console.error("Error during disconnection cleanup:", error);
                }
            }), 15000);
            this.timeouts.set(userId, timeout);
        });
    }
    checkUserActiveInOtherSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if user has an active WebSocket connection
            let isActive = false;
            this.wss.clients.forEach((client) => {
                const extendedClient = client;
                if (extendedClient.userId === userId &&
                    extendedClient.readyState === WebSocket.OPEN) {
                    isActive = true;
                }
            });
            // Also check database for recent activity if needed
            if (!isActive) {
                const user = yield User.findById(userId);
                if (user && !user.temporarilyDisconnected) {
                    isActive = true;
                }
            }
            return isActive;
        });
    }
    // send to all
    broadcast(action, payload) {
        const message = { action, payload };
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
    // send to specific
    sendMessage(ws, action, payload) {
        const message = { action, payload };
        ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(message));
    }
    // send to all except sender
    sendMessageToAllExceptSender(ws, action, payload) {
        const message = { action, payload };
        this.wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
    // send to everyone in room
    sendMessageToEveryoneInRoom(roomUsers, action, payload) {
        const message = { action, payload };
        roomUsers.forEach((user) => {
            if (user.readyState === WebSocket.OPEN) {
                user.send(JSON.stringify(message));
            }
        });
    }
    // send to everyone in room except sender
    sendMessageToEveryoneExpectSenderInRoom(ws, roomUsers, action, payload) {
        const message = { action, payload };
        roomUsers.forEach((user) => {
            if (user !== ws && user.readyState === WebSocket.OPEN) {
                user.send(JSON.stringify(message));
            }
        });
    }
    // send to everyone in room except owner
    sendMessageToEveryoneExceptOwnerInRoom(ownerWs, roomUsers, action, payload) {
        const message = { action, payload };
        roomUsers.forEach((user) => {
            if (user !== ownerWs && user.readyState === WebSocket.OPEN) {
                user.send(JSON.stringify(message));
            }
        });
    }
}
export default WebSocketService;
