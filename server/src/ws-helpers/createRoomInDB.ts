import { Room } from "src/models/room.model";
import { CreateRoomSchema } from "src/schema/createRoomSchema";
import { ApiError } from "src/utils/ApiError";
import { z } from "zod";

type CreateRoomType = z.infer<typeof CreateRoomSchema>;

export async function createRoomInDB(payload: CreateRoomType, userId: string) {
  const parsedPayload = CreateRoomSchema.safeParse(payload);

  if (!parsedPayload.success) {
    throw new ApiError(
      400,
      parsedPayload.error.errors.map((error) => error).join(", ")
    );
  }

  const room = await Room.create({ ...parsedPayload.data, owner: userId });
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

  return updatedRoom[0];
}
