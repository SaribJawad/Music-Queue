import { AddSongSchema } from "src/schema/addSongSchema";
import RoomService from "src/services/RoomService";
import { ClientMessage } from "src/websocket/WebSocketService";
import { WebSocket } from "ws";

interface IHandleAddSong {
  ws: WebSocket;
  clientData: ClientMessage;
  wsService: any;
}

export async function handleAddSong({
  clientData,
  ws,
  wsService,
}: IHandleAddSong) {
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
    console.log(roomUsers);
    wsService.sendMessageToEveryoneInRoom(roomUsers, "ADD_SONG", addedSong);
    // wsService.broadcast("ADD_SONG", addedSong);
  } catch (error) {
    console.error("Error adding song:", error);
    wsService.sendMessage(
      ws,
      "ERROR",
      "An unexpected error occurred while adding song."
    );
  }
}
