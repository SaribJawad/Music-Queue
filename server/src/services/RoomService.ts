import { Room } from "src/models/room.model";
import { CreateRoomSchema } from "src/schema/createRoomSchema";
import { createRoomInDB } from "src/ws-helpers/createRoomInDB";
import { WebSocket } from "ws";
import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;

const RoomPayLoadSchema = CreateRoomSchema.extend({
  ws: z.instanceof(WebSocket),
  userId: z.string().regex(objectIdRegex, "Invalid MongoDB ObjectID"),
});

type CreateRoomPayloadType = z.infer<typeof RoomPayLoadSchema>;

class RoomService {
  private static rooms: Map<
    string,
    {
      users: Set<WebSocket>;
      roomName: string;
      roomType: "youtube" | "soundcloud";
      roomPassword: string;
    }
  > = new Map();

  static async initializeRooms() {
    try {
      const rooms = await Room.find();
      rooms.forEach((room) =>
        this.rooms.set(room.roomName, {
          users: new Set(),
          roomName: room.roomName,
          roomType: room.roomType,
          roomPassword: room.roomPassword,
        })
      );
    } catch (error) {
      console.error("Error initializing rooms:", error);
    }
  }

  static async createRoom(payload: CreateRoomPayloadType) {
    try {
      const roomFromDB = await createRoomInDB(payload, payload.userId);

      RoomService.rooms.set(payload.roomName, {
        users: new Set([payload.ws]),
        roomName: payload.roomName,
        roomPassword: payload.roomPassword,
        roomType: payload.roomType,
      });

      return roomFromDB;
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Failed to create room";

      throw new Error(errMessage);
    }
  }
}

export default RoomService;
