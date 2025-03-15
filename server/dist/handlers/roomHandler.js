var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CreateRoomSchema, JoinRoomSchema, objectIdRegex, RefreshJoinRoomSchema, } from "../schema/roomSchemas";
import RoomService from "../services/RoomService";
import { z } from "zod";
export function handleCreateRoom(_a) {
    return __awaiter(this, arguments, void 0, function* ({ ws, clientData, wsService, }) {
        try {
            const parsedCreateRoomData = CreateRoomSchema.safeParse(clientData.payload);
            if (!parsedCreateRoomData.success) {
                const errorMsg = parsedCreateRoomData.error.errors
                    .map((err) => err.message)
                    .join(", ");
                wsService.sendMessage(ws, "ERROR", errorMsg);
                return;
            }
            const { roomName, roomPassword, roomType, userId } = parsedCreateRoomData.data;
            const room = yield RoomService.createRoom({
                ws,
                roomName,
                roomPassword,
                roomType,
                userId,
            });
            if (!room) {
                wsService.sendMessage(ws, "ERROR", "Failed to create room");
                return;
            }
            wsService.sendMessage(ws, "CREATE_ROOM", room);
            wsService.broadcast("ADD_ROOM", room);
        }
        catch (error) {
            console.error("Error creating room:", error);
            wsService.sendMessage(ws, "ERROR", "An unexpected error occurred while creating room.");
        }
    });
}
export function handleJoinRoom(_a) {
    return __awaiter(this, arguments, void 0, function* ({ ws, clientData, wsService, }) {
        try {
            const parsedJoinRoomData = JoinRoomSchema.safeParse(clientData.payload);
            if (!parsedJoinRoomData.success) {
                const errorMsg = parsedJoinRoomData.error.errors
                    .map((err) => err.message)
                    .join(", ");
                wsService.sendMessage(ws, "ERROR", errorMsg);
                return;
            }
            const { roomPassword, roomId, userId } = parsedJoinRoomData.data;
            const joinedRoomData = yield RoomService.joinRoom({
                ws,
                roomPassword,
                roomId,
                userId,
            });
            if (joinedRoomData) {
                wsService.sendMessageToEveryoneExpectSenderInRoom(ws, joinedRoomData.connectedClients, "USER_JOINED", `${joinedRoomData.userName} joined the room`);
                wsService.sendMessageToEveryoneExceptOwnerInRoom(joinedRoomData === null || joinedRoomData === void 0 ? void 0 : joinedRoomData.ownerWs, joinedRoomData === null || joinedRoomData === void 0 ? void 0 : joinedRoomData.connectedClients, "JOIN_ROOM", joinedRoomData === null || joinedRoomData === void 0 ? void 0 : joinedRoomData.roomId);
            }
        }
        catch (error) {
            console.error("Error joining room:", error);
            let errMessage = error instanceof Error
                ? error.message
                : "An unexpected error occurred while joining room.";
            wsService.sendMessage(ws, "ERROR", errMessage);
        }
    });
}
export function handleRefreshJoinRoom(_a) {
    return __awaiter(this, arguments, void 0, function* ({ clientData, ws, wsService, }) {
        try {
            const parsedRefreshJoinRoom = RefreshJoinRoomSchema.safeParse(clientData.payload);
            if (!parsedRefreshJoinRoom.success) {
                const errorMsg = parsedRefreshJoinRoom.error.errors
                    .map((err) => err.message)
                    .join(", ");
                wsService.sendMessage(ws, "ERROR", errorMsg);
                return;
            }
            const { roomId } = parsedRefreshJoinRoom.data;
            const { noOfJoinedUsers, connectedClients } = yield RoomService.refreshJoinRoom({
                ws,
                roomId,
                userId: ws.userId,
            });
            wsService.sendMessageToEveryoneInRoom(connectedClients, "REFRESH_ROOM", noOfJoinedUsers);
        }
        catch (error) {
            console.error("Error refresh join room:", error);
            let errMessage = error instanceof Error
                ? error.message
                : "An unexpected error occurred while refreshing join room.";
            wsService.sendMessage(ws, "ERROR", errMessage);
        }
    });
}
export function handleLeaveRoom(_a) {
    return __awaiter(this, arguments, void 0, function* ({ clientData, ws, wsService, }) {
        var _b;
        try {
            const parsedHandleLeaveRoom = z
                .object({
                roomId: z.string().regex(objectIdRegex),
                userId: z.string().regex(objectIdRegex),
            })
                .safeParse(clientData.payload);
            if (!parsedHandleLeaveRoom.success) {
                const errorMsg = parsedHandleLeaveRoom.error.errors
                    .map((err) => err.message)
                    .join(", ");
                wsService.sendMessage(ws, "ERROR", errorMsg);
                return;
            }
            const { roomId, userId } = parsedHandleLeaveRoom.data;
            const { username, connectedClient } = yield RoomService.leaveRoom({
                userId,
                roomId,
            });
            wsService.sendMessageToEveryoneExpectSenderInRoom(ws, connectedClient, "LEFT_ROOM", {
                message: `${username} left the room`,
                noOfJoinedUsers: connectedClient.size - 1,
            });
            wsService.sendMessage(ws, "LEAVE_ROOM", `${username} left the room`);
            (_b = RoomService.rooms.get(roomId)) === null || _b === void 0 ? void 0 : _b.users.delete(ws);
        }
        catch (error) {
            console.error("Error joining room:", error);
            let errMessage = error instanceof Error
                ? error.message
                : "An unexpected error occurred while joining room.";
            wsService.sendMessage(ws, "ERROR", errMessage);
        }
    });
}
export function handleEndRoom(_a) {
    return __awaiter(this, arguments, void 0, function* ({ clientData, ws, wsService }) {
        try {
            const parsedHandleLeaveRoom = z
                .object({
                roomId: z.string().regex(objectIdRegex),
                userId: z.string().regex(objectIdRegex),
            })
                .safeParse(clientData.payload);
            if (!parsedHandleLeaveRoom.success) {
                const errorMsg = parsedHandleLeaveRoom.error.errors
                    .map((err) => err.message)
                    .join(", ");
                wsService.sendMessage(ws, "ERROR", errorMsg);
                return;
            }
            const { roomId, userId } = parsedHandleLeaveRoom.data;
            const { connectedClients } = yield RoomService.endRoom({
                userId,
                roomId,
            });
            wsService.sendMessage(ws, "END_ROOM", roomId);
            wsService.sendMessageToEveryoneExceptOwnerInRoom(ws, connectedClients, "ROOM_ENDED", roomId);
            wsService.broadcast("REMOVE_ROOM", roomId);
            RoomService.rooms.delete(roomId);
        }
        catch (error) {
            console.error("Error joining room:", error);
            let errMessage = error instanceof Error
                ? error.message
                : "An unexpected error occurred while joining room.";
            wsService.sendMessage(ws, "ERROR", errMessage);
        }
    });
}
export function handleTimeStamps(_a) {
    return __awaiter(this, arguments, void 0, function* ({ clientData, ws, wsService, }) {
        try {
            const parsedHandleTimeStamps = z
                .object({
                roomId: z.string().regex(objectIdRegex),
                userId: z.string().regex(objectIdRegex),
                username: z.string(),
                timestamps: z.number(),
            })
                .safeParse(clientData.payload);
            if (!parsedHandleTimeStamps.success) {
                const errorMsg = parsedHandleTimeStamps.error.errors
                    .map((err) => err.message)
                    .join(", ");
                wsService.sendMessage(ws, "ERROR", errorMsg);
                return;
            }
            const { roomId, timestamps, userId, username: usernameFromClient, } = parsedHandleTimeStamps.data;
            const handleTimeStampsData = yield RoomService.timestamps({
                roomId,
                timestamps,
                userId,
                username: usernameFromClient,
            });
            wsService.sendMessage(handleTimeStampsData === null || handleTimeStampsData === void 0 ? void 0 : handleTimeStampsData.ownerWs, "TIMESTAMPS", {
                userId,
                username: handleTimeStampsData === null || handleTimeStampsData === void 0 ? void 0 : handleTimeStampsData.username,
                timestamps: handleTimeStampsData === null || handleTimeStampsData === void 0 ? void 0 : handleTimeStampsData.timestamps,
            });
        }
        catch (error) {
            console.error("Error joining room:", error);
            let errMessage = error instanceof Error
                ? error.message
                : "An unexpected error occurred while joining room.";
            wsService.sendMessage(ws, "ERROR", errMessage);
        }
    });
}
export function handleSyncAll(_a) {
    return __awaiter(this, arguments, void 0, function* ({ clientData, ws, wsService }) {
        const parsedClientData = z
            .object({
            roomId: z.string().regex(objectIdRegex),
            timestamps: z.number(),
        })
            .safeParse(clientData.payload);
        if (!parsedClientData.success) {
            const errorMsg = parsedClientData.error.errors.map((err) => err).join(", ");
            wsService.sendMessage(ws, "ERROR", errorMsg);
            return;
        }
        const { roomId, timestamps } = parsedClientData.data;
        const activeRoomSession = RoomService.rooms.get(roomId);
        if (!activeRoomSession) {
            wsService.sendMessage(ws, "ERROR", "Room not found in active session");
            return;
        }
        wsService.sendMessageToEveryoneInRoom(activeRoomSession.users, "SYNC_ALL", timestamps);
    });
}
