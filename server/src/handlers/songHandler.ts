import {
  AddSongSchema,
  DeleteSongSchema,
  PlayNextSongSchema,
  UpVoteSongSchema,
} from "@/schema/songSchemas";
import RoomService from "@/services/RoomService";
import { ClientMessage } from "@/websocket/WebSocketService";
import { WebSocket } from "ws";

interface IHandleArg {
  ws: WebSocket;
  clientData: ClientMessage;
  wsService: any;
}

export async function handleAddSong({ clientData, ws, wsService }: IHandleArg) {
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

    const { filteredSong: addedSong, roomUsers } = await RoomService.addSong({
      songUrl,
      roomId,
    });

    if (!addedSong) {
      wsService.sendMessage(ws, "ERROR", "Failed to add song");
      return;
    }
    wsService.sendMessageToEveryoneInRoom(roomUsers, "ADD_SONG", addedSong);
  } catch (error) {
    console.error("Error adding song:", error);
    wsService.sendMessage(
      ws,
      "ERROR",
      "An unexpected error occurred while adding song."
    );
  }
}

export async function handleDeleteSong({
  clientData,
  ws,
  wsService,
}: IHandleArg) {
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
    const { connectedClients } = await RoomService.deleteSong({
      roomId,
      songId,
    });

    wsService.sendMessageToEveryoneInRoom(
      connectedClients,
      "DELETE_SONG",
      songId
    );
    wsService.sendMessage(ws, "SONG_DELETED", "Song removed");
  } catch (error) {
    console.error("Error deleting song:", error);
    wsService.sendMessage(
      ws,
      "ERROR",
      "An unexpected error occurred while deleting song."
    );
  }
}

export async function handleUpVoteSong({
  clientData,
  ws,
  wsService,
}: IHandleArg) {
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

    const {
      roomId,
      songId,
      userId: userIdFromClient,
    } = parsedUpVoteSongData.data;

    const { connectedClients, userId } = await RoomService.upvoteSong({
      roomId,
      songId,
      userId: userIdFromClient,
    });

    wsService.sendMessageToEveryoneInRoom(connectedClients, "UPVOTE_SONG", {
      userId,
      songId,
    });
  } catch (error) {
    console.error("Error deleting song:", error);
    wsService.sendMessage(
      ws,
      "ERROR",
      "An unexpected error occurred while deleting song."
    );
  }
}

export async function handlePlayNextSong({
  clientData,
  ws,
  wsService,
}: IHandleArg) {
  console.log(clientData);
  try {
    const parsedPlayNextSongData = PlayNextSongSchema.safeParse(
      clientData.payload
    );

    if (!parsedPlayNextSongData.success) {
      console.log(parsedPlayNextSongData.error);
      const errorMsg = parsedPlayNextSongData.error.errors
        .map((err) => err.message)
        .join(", ");
      wsService.sendMessage(ws, "ERROR", errorMsg);
      return;
    }
    const { roomId, songId: songIdFromClient } = parsedPlayNextSongData.data;

    const { connectedClients, song } = await RoomService.playNextSong({
      roomId,
      songId: songIdFromClient,
    });

    wsService.sendMessageToEveryoneInRoom(
      connectedClients,
      "PLAY_NEXT_SONG",
      song
    );
    // TODOOO COMPLETE
  } catch (error) {
    console.error("Error deleting song:", error);
    wsService.sendMessage(
      ws,
      "ERROR",
      "An unexpected error occurred while deleting song."
    );
  }
}
