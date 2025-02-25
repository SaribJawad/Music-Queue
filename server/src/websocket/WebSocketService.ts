import { IncomingMessage, Server } from "http";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { WebSocket, WebSocketServer } from "ws";
import { ACCESS_TOKEN_SECRET } from "src/config/config";
import RoomService from "src/services/RoomService";
import { CreateRoomSchema } from "src/schema/createRoomSchema";

interface ClientMessage {
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
    const refreshToken = cookies.refreshToken || null;

    try {
      const decodedToken = jwt.verify(accessToken!, ACCESS_TOKEN_SECRET!);
      this.userId = (decodedToken as jwt.JwtPayload)._id;
    } catch (error) {
      ws.close(4401, "Unauthorized");
      return;
    }

    await RoomService.initializeRooms().catch((err) => {
      console.error("Failed to initialize rooms:", err);
    });

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
          const parsedClientData = CreateRoomSchema.safeParse(
            clientData.payload
          );

          if (!parsedClientData.success) {
            const errorMsg = parsedClientData.error.errors
              .map((err) => err.message)
              .join(", ");
            this.sendMessage(ws, "ERROR", errorMsg);
            return;
          }

          const { roomName, roomPassword, roomType } = parsedClientData.data;

          const room = await RoomService.createRoom({
            ws,
            roomName,
            roomPassword,
            roomType,
            userId: this.userId!,
          });
          if (!room) {
            this.sendMessage(ws, "ERROR", "Failed to create room");
            return;
          }

          this.broadcast("CREATE_ROOM", room);

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
    const messsage: ServerMessage = { action, payload };
    ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(messsage));
  }

  // send to all except sender
  public sendMessageToAllExceptSender(
    ws: WebSocket,
    action: string,
    payload?: any
  ) {
    const messsage: ServerMessage = { action, payload };

    this.wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messsage));
      }
    });
  }
}

export default WebSocketService;
