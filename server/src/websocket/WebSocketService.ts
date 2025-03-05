import { Server } from "http";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { WebSocket, WebSocketServer } from "ws";
import { ACCESS_TOKEN_SECRET } from "src/config/config";
import RoomService from "src/services/RoomService";
import {
  handleCreateRoom,
  handleJoinRoom,
  handleRefreshJoinRoom,
} from "src/handlers/roomHandler";
import { handleAddSong } from "src/handlers/songHandler";

export interface ClientMessage {
  action: string;
  payload: any;
  requestId?: string;
}

interface ServerMessage {
  action: string;
  payload?: any;
  error?: string;
}

class WebSocketService {
  private wss: WebSocketServer;
  private userId: string | null;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.userId = null;
    this.wss.on("connection", this.handleConnection.bind(this));
  }

  private async handleConnection(ws: WebSocket, req: any) {
    const cookies = cookie.parse(req.headers.cookie || "");
    const accessToken = cookies.accessToken || null;
    try {
      const decodedToken = jwt.verify(accessToken!, ACCESS_TOKEN_SECRET!);
      this.userId = (decodedToken as jwt.JwtPayload)._id;
    } catch (error) {
      ws.close(4401, "Unauthorized");
      return;
    }

    // await RoomService.initializeRooms().catch((err) => {
    //   console.error("Failed to initialize rooms:", err);
    // });

    console.log("on intialize", RoomService.rooms);

    ws.on("message", (data: ClientMessage) =>
      this.handleMessage(ws, data.toString())
    );
    ws.on("error", console.error);
  }

  private async handleMessage(ws: WebSocket, data: string) {
    try {
      const clientData: ClientMessage = JSON.parse(data);

      switch (clientData.action) {
        case "CREATE_ROOM":
          await handleCreateRoom({ ws, clientData, wsService: this });
          break;

        case "ADD_SONG":
          await handleAddSong({ ws, clientData, wsService: this });
          break;

        case "JOIN_ROOM":
          await handleJoinRoom({ ws, clientData, wsService: this });
          break;

        case "REFRESH_JOIN_ROOM":
          await handleRefreshJoinRoom({ ws, clientData, wsService: this });
          break;

        default:
          break;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Internal Server Error";
      this.sendMessage(ws, "ERROR", errorMessage);
    }
  }

  // send to all
  public broadcast(action: string, payload?: any) {
    const message: ServerMessage = { action, payload };

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  // send to specific
  public sendMessage(ws: WebSocket, action: string, payload?: any) {
    const message: ServerMessage = { action, payload };
    ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(message));
  }

  // send to all except sender
  public sendMessageToAllExceptSender(
    ws: WebSocket,
    action: string,
    payload?: any
  ) {
    const message: ServerMessage = { action, payload };

    this.wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  // send to everyone in room
  public sendMessageToEveryoneInRoom(
    roomUsers: WebSocket[],
    action: string,
    payload?: any
  ) {
    const message: ServerMessage = { action, payload };

    roomUsers.forEach((user) => {
      if (user.readyState === WebSocket.OPEN) {
        user.send(JSON.stringify(message));
      }
    });
  }

  // send to everyone in room except sender
  public sendMessageToEveryoneExpectSenderInRoom(
    ws: WebSocket,
    roomUsers: WebSocket[],
    action: string,
    payload?: any
  ) {
    const message: ServerMessage = { action, payload };

    roomUsers.forEach((user) => {
      if (user !== ws && user.readyState === WebSocket.OPEN) {
        user.send(JSON.stringify(message));
      }
    });
  }

  // send to everyone in room except owner
  public sendMessageToEveryoneExceptOwnerInRoom(
    ownerWs: WebSocket,
    roomUsers: Set<WebSocket>,
    action: string,
    payload?: any
  ) {
    const message: ServerMessage = { action, payload };

    roomUsers.forEach((user) => {
      if (user !== ownerWs && user.readyState === WebSocket.OPEN) {
        user.send(JSON.stringify(message));
      }
    });
  }
}

export default WebSocketService;
