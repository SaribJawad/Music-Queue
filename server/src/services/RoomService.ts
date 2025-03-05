import mongoose, { ObjectId, Types } from "mongoose";
import { Room } from "src/models/room.model";
import { Song } from "src/models/song.model";
import { User } from "src/models/user.model";
import { AddSongSchema, extractedSongSchema } from "src/schema/addSongSchema";
import {
  CreateRoomSchema,
  JoinRoomSchema,
  RefreshJoinRoomSchema,
} from "src/schema/createRoomSchema";
import { ApiError } from "src/utils/ApiError";
import { extractYouTubeID } from "src/utils/extractYoutubeId";
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

type CreateRoomPayloadType = z.infer<typeof RoomPayLoadSchema>;
type AddSongPayloadType = z.infer<typeof AddSongSchema>;
type JoinRoomPayloadType = z.infer<typeof JoinRoomPayloadSchema>;
type RefreshJoinRoomType = z.infer<typeof RefreshJoinRoomPayloadSchema>;

class RoomService {
  public static rooms: Map<
    string,
    {
      users: Set<WebSocket>;
      roomName: string;
      roomType: "youtube" | "soundcloud";
      ownerWs?: WebSocket;
      roomPassword: string;
    }
  > = new Map();

  static async initializeRooms() {
    try {
      const rooms = await Room.find();

      rooms.forEach((room) =>
        this.rooms.set(String(room._id), {
          users: new Set<WebSocket>(),
          roomName: room.roomName,
          roomType: room.roomType,
          ownerWs: undefined,
          roomPassword: room.roomPassword,
        })
      );
    } catch (error) {
      console.error("Error initializing rooms:", error);
    }
  }

  static async createRoom(payload: CreateRoomPayloadType) {
    try {
      const room = await Room.create({
        roomType: payload.roomType,
        roomName: payload.roomName,
        roomPassword: payload.roomPassword,
        owner: payload.userId,
      });
      const updatedRoom = await Room.aggregate([
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

      await User.findByIdAndUpdate(
        payload.userId,
        {
          isAlive: true,
          $push: { rooms: room._id },
        },
        { new: true }
      );

      RoomService.rooms.set(String(room._id), {
        users: new Set(),
        roomName: payload.roomName,
        roomPassword: payload.roomPassword,
        ownerWs: payload.ws,
        roomType: payload.roomType,
      });

      RoomService.rooms.get(String(room._id))?.users.add(payload.ws); // Use same reference

      console.log("creating room", RoomService.rooms);

      return updatedRoom[0];
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Failed to create room";

      throw new Error(errMessage);
    }
  }

  static async addSong(payload: AddSongPayloadType) {
    try {
      const { roomId, songUrl } = payload;

      const room = await Room.findById(roomId);

      if (!room) {
        throw new ApiError(404, "Room not found");
      }

      const roomUsers = this.rooms.get(String(room._id))?.users;

      const extractedId = extractYouTubeID(songUrl);

      const {
        id,
        title,
        channel,
        thumbnail: { thumbnails },
      } = await youtubesearchapi.GetVideoDetails(extractedId);

      const validatedData = extractedSongSchema.parse({
        externalId: id,
        title,
        source: room.roomType,
        artist: channel,
        coverImageUrl: thumbnails[thumbnails.length - 1].url,
        room: roomId,
      });

      const song = await Song.create(validatedData);
      const filteredSong = await Song.findById(song._id)
        .select("-createdAt -updatedAt -__v")
        .lean();

      let updateQuery;
      if (!room.currentSong && room.songQueue.length === 0) {
        updateQuery = { currentSong: filteredSong };
      } else {
        updateQuery = { $push: { songQueue: filteredSong } };
      }

      await Room.findByIdAndUpdate(roomId, updateQuery, {
        new: true,
      });

      return { filteredSong, roomUsers };
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Failed to create room";

      throw new Error(errMessage);
    }
  }

  static async joinRoom(payload: JoinRoomPayloadType) {
    try {
      const { roomId, roomPassword, userId, ws } = payload;
      const room = await Room.findById(roomId);
      const user = await User.findById(userId);
      //   const roomObjectId = new mongoose.Types.ObjectId(roomId);

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

      const isValidPassword = await room.isPasswordCorrect(roomPassword!);
      if (!isValidPassword) {
        throw new ApiError(401, "Invalid password");
      }
      room.users.push(userId as any);
      await room.save({ validateBeforeSave: false });
      user.isJoined = {
        status: true,
        roomId: roomId as any,
      };
      await user.save({ validateBeforeSave: false });

      activeRoomSession.users.add(ws);

      // Set up disconnect handler for the WebSocket
      ws.on("close", () => {
        console.log(`WebSocket disconnected from room ${roomId}`);
        activeRoomSession.users.delete(ws);

        // Cleanup empty rooms from memory
        // if (activeRoomSession.users.size === 0) {
        //   console.log(`Removing empty room session: ${roomId}`);
        //   this.rooms.delete(roomId);
        // }
      });

      const joinedUsers = room.users.filter(
        (user) => user.toString() !== (room.owner as any).toString()
      );

      //   console.log(
      //     "username",
      //     user.name,
      //     "roomId",
      //     room._id,
      //     "isNewUser",
      //     "activeSessionRoomUser",
      //     activeRoomSession.users
      //   );

      return {
        userName: user?.name,
        roomId: room._id,
        connectedClients: activeRoomSession.users,
        ownerWs: activeRoomSession.ownerWs,
      };
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Failed to join room";
      throw new Error(errMessage);
    }
  }

  static async refreshJoinRoom(payload: RefreshJoinRoomType) {
    const { roomId, userId, ws } = payload;

    if (!mongoose.isValidObjectId(roomId)) {
      throw new ApiError(400, "Invalid Room ID");
    }

    const room = await Room.findById(roomId);
    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    const roomIdString = String(room._id);

    if (!this.rooms.has(roomIdString)) {
      this.rooms.set(roomIdString, {
        users: new Set<WebSocket>(),
        roomName: room.roomName,
        roomPassword: room.roomPassword,
        roomType: room.roomType,
        ownerWs: undefined,
      });
    }

    const activeSessionRoom = this.rooms.get(roomIdString)!;

    console.log("Before refresh:", {
      roomId,
      userId,
      isOwner: String(room.owner) === userId,
      isUserInRoom: room.users.some((user) => user.toString() === userId),
      currentOwnerWs: activeSessionRoom?.ownerWs || undefined,
      currentUsersCount: activeSessionRoom?.users.size,
    });

    if (String(room.owner) === userId) {
      if (activeSessionRoom?.ownerWs !== ws) {
        activeSessionRoom!.ownerWs = ws;
        activeSessionRoom.users.add(ws);
        console.log("Owner WebSocket updated");
      }
    } else if (
      room.users.some(
        (user) => user.toString() === userId && !activeSessionRoom.users.has(ws)
      )
    ) {
      activeSessionRoom?.users.add(ws);
      console.log("User WebSocket added");
    } else {
      console.warn("User not found in room");
    }

    // Debugging output after changes
    console.log("After refresh:", {
      ownerWs: activeSessionRoom?.ownerWs || undefined,
      usersCount: activeSessionRoom?.users.size,
    });

    ws.on("close", () => {
      //   console.log(`WebSocket disconnected from room ${roomId}`);
      activeSessionRoom.users.delete(ws);
    });
  }
}

export default RoomService;
