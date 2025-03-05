import {
  CreateRoomSchema,
  JoinRoomSchema,
  RefreshJoinRoomSchema,
} from "src/schema/createRoomSchema";
import RoomService from "src/services/RoomService";
import { ClientMessage } from "src/websocket/WebSocketService";
import { WebSocket } from "ws";

interface IHandleArg {
  ws: WebSocket;
  clientData: ClientMessage;
  wsService: any;
}

export async function handleCreateRoom({
  ws,
  clientData,
  wsService,
}: IHandleArg) {
  try {
    const parsedCreateRoomData = CreateRoomSchema.safeParse(clientData.payload);

    if (!parsedCreateRoomData.success) {
      const errorMsg = parsedCreateRoomData.error.errors
        .map((err) => err.message)
        .join(", ");
      wsService.sendMessage(ws, "ERROR", errorMsg);
      return;
    }

    const { roomName, roomPassword, roomType, userId } =
      parsedCreateRoomData.data;

    const room = await RoomService.createRoom({
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
  } catch (error) {
    console.error("Error creating room:", error);
    wsService.sendMessage(
      ws,
      "ERROR",
      "An unexpected error occurred while creating room."
    );
  }
}

export async function handleJoinRoom({
  ws,
  clientData,
  wsService,
}: IHandleArg) {
  try {
    const parsedJoinRoomData = JoinRoomSchema.safeParse(clientData.payload);

    if (!parsedJoinRoomData.success) {
      const errorMsg = parsedJoinRoomData.error.errors
        .map((err) => err.message)
        .join(", ");
      wsService.sendMessage(ws, "ERROR", errorMsg);
      return;
    }

    const { roomPassword, roomId } = parsedJoinRoomData.data;

    const joinedRoomData = await RoomService.joinRoom({
      ws,
      roomPassword,
      roomId,
      userId: wsService.userId!,
    });
    if (joinedRoomData) {
      wsService.sendMessageToEveryoneExpectSenderInRoom(
        ws,
        joinedRoomData.connectedClients,
        "USER_JOINED",
        `${joinedRoomData.userName} joined the room`
      );
      console.log(joinedRoomData.ownerWs);
      wsService.sendMessageToEveryoneExceptOwnerInRoom(
        joinedRoomData?.ownerWs,
        joinedRoomData?.connectedClients,
        "JOIN_ROOM",
        joinedRoomData?.roomId
      );
    }
  } catch (error) {
    console.error("Error joining room:", error);
    let errMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while joining room.";
    wsService.sendMessage(ws, "ERROR", errMessage);
  }
}

export async function handleRefreshJoinRoom({
  clientData,
  ws,
  wsService,
}: IHandleArg) {
  try {
    const parsedRefreshJoinRoom = RefreshJoinRoomSchema.safeParse(
      clientData.payload
    );

    if (!parsedRefreshJoinRoom.success) {
      const errorMsg = parsedRefreshJoinRoom.error.errors
        .map((err) => err.message)
        .join(", ");
      wsService.sendMessage(ws, "ERROR", errorMsg);
      return;
    }

    const { roomId } = parsedRefreshJoinRoom.data;
    await RoomService.refreshJoinRoom({
      ws,
      roomId,
      userId: wsService.userId!,
    });
  } catch (error) {
    console.error("Error refresh join room:", error);
    let errMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while refreshing join room.";
    wsService.sendMessage(ws, "ERROR", errMessage);
  }
}
