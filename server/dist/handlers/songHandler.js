var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AddSongSchema, DeleteSongSchema, PlayNextSongSchema, UpVoteSongSchema, } from "src/schema/songSchemas.js";
import RoomService from "src/services/RoomService.js";
export function handleAddSong(_a) {
    return __awaiter(this, arguments, void 0, function* ({ clientData, ws, wsService }) {
        try {
            const parsedAddSongData = AddSongSchema.safeParse(clientData.payload);
            if (!parsedAddSongData.success) {
                const errorMsg = parsedAddSongData.error.errors
                    .map((err) => err.message)
                    .join(", ");
                wsService.sendMessage(ws, "ERROR", errorMsg);
                return;
            }
            const { roomId, songUrl } = parsedAddSongData.data;
            const { filteredSong: addedSong, roomUsers } = yield RoomService.addSong({
                songUrl,
                roomId,
            });
            if (!addedSong) {
                wsService.sendMessage(ws, "ERROR", "Failed to add song");
                return;
            }
            wsService.sendMessageToEveryoneInRoom(roomUsers, "ADD_SONG", addedSong);
        }
        catch (error) {
            console.error("Error adding song:", error);
            wsService.sendMessage(ws, "ERROR", "An unexpected error occurred while adding song.");
        }
    });
}
export function handleDeleteSong(_a) {
    return __awaiter(this, arguments, void 0, function* ({ clientData, ws, wsService, }) {
        try {
            const parsedDeleteSongData = DeleteSongSchema.safeParse(clientData.payload);
            if (!parsedDeleteSongData.success) {
                console.log(parsedDeleteSongData.error);
                const errorMsg = parsedDeleteSongData.error.errors
                    .map((err) => err.message)
                    .join(", ");
                wsService.sendMessage(ws, "ERROR", errorMsg);
                return;
            }
            const { roomId, songId } = parsedDeleteSongData.data;
            const { connectedClients } = yield RoomService.deleteSong({
                roomId,
                songId,
            });
            wsService.sendMessageToEveryoneInRoom(connectedClients, "DELETE_SONG", songId);
            wsService.sendMessage(ws, "SONG_DELETED", "Song removed");
        }
        catch (error) {
            console.error("Error deleting song:", error);
            wsService.sendMessage(ws, "ERROR", "An unexpected error occurred while deleting song.");
        }
    });
}
export function handleUpVoteSong(_a) {
    return __awaiter(this, arguments, void 0, function* ({ clientData, ws, wsService, }) {
        try {
            const parsedUpVoteSongData = UpVoteSongSchema.safeParse(clientData.payload);
            if (!parsedUpVoteSongData.success) {
                console.log(parsedUpVoteSongData.error);
                const errorMsg = parsedUpVoteSongData.error.errors
                    .map((err) => err.message)
                    .join(", ");
                wsService.sendMessage(ws, "ERROR", errorMsg);
                return;
            }
            const { roomId, songId, userId: userIdFromClient, } = parsedUpVoteSongData.data;
            const { connectedClients, userId } = yield RoomService.upvoteSong({
                roomId,
                songId,
                userId: userIdFromClient,
            });
            wsService.sendMessageToEveryoneInRoom(connectedClients, "UPVOTE_SONG", {
                userId,
                songId,
            });
        }
        catch (error) {
            console.error("Error deleting song:", error);
            wsService.sendMessage(ws, "ERROR", "An unexpected error occurred while deleting song.");
        }
    });
}
export function handlePlayNextSong(_a) {
    return __awaiter(this, arguments, void 0, function* ({ clientData, ws, wsService, }) {
        console.log(clientData);
        try {
            const parsedPlayNextSongData = PlayNextSongSchema.safeParse(clientData.payload);
            if (!parsedPlayNextSongData.success) {
                console.log(parsedPlayNextSongData.error);
                const errorMsg = parsedPlayNextSongData.error.errors
                    .map((err) => err.message)
                    .join(", ");
                wsService.sendMessage(ws, "ERROR", errorMsg);
                return;
            }
            const { roomId, songId: songIdFromClient } = parsedPlayNextSongData.data;
            const { connectedClients, song } = yield RoomService.playNextSong({
                roomId,
                songId: songIdFromClient,
            });
            wsService.sendMessageToEveryoneInRoom(connectedClients, "PLAY_NEXT_SONG", song);
            // TODOOO COMPLETE
        }
        catch (error) {
            console.error("Error deleting song:", error);
            wsService.sendMessage(ws, "ERROR", "An unexpected error occurred while deleting song.");
        }
    });
}
