import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LiveRoomType } from "../../schemas/roomSchema";
import { RootState } from "../../app/store";
import { SongType } from "../../schemas/songSchema";

interface ILiveRoomState {
  liveRoom: LiveRoomType | undefined;
  roomType: "youtube" | "soundcloud" | undefined;
  noOfJoinedUsers: number;
  joinedUsersTimestamps: JoinedUsersTimestamps[];
  liveRoomTimestamps: number | null;
}

interface JoinedUsersTimestamps {
  userId: string;
  username: string;
  timestamps: number;
}

const initialState: ILiveRoomState = {
  liveRoom: undefined,
  roomType: undefined,
  noOfJoinedUsers: 0,
  joinedUsersTimestamps: [],
  liveRoomTimestamps: null,
};

export const liveRoomState = createSlice({
  name: "liveRoom",
  initialState,
  reducers: {
    setLiveRoom: (state, action: PayloadAction<LiveRoomType>) => {
      state.liveRoom = action.payload;
      state.roomType = action.payload.roomType;
    },
    setCurrentSong: (state, action: PayloadAction<SongType | null>) => {
      state.liveRoom!.currentSong = action.payload;
    },
    setRemoveLiveRoom: (state) => {
      (state.liveRoom = undefined), (state.roomType = undefined);
    },
    setNoOfJoinedUsers: (state, action: PayloadAction<number>) => {
      state.noOfJoinedUsers = action.payload;
    },
    setJoinedUsersTimestamps: (
      state,
      action: PayloadAction<JoinedUsersTimestamps>
    ) => {
      const existingIndex = state.joinedUsersTimestamps.findIndex(
        (entry) => entry.userId === action.payload.userId
      );

      if (existingIndex === -1) {
        state.joinedUsersTimestamps.push(action.payload);
      } else {
        state.joinedUsersTimestamps[existingIndex] = action.payload;
      }
    },
    setLiveRoomTimestamps: (state, action: PayloadAction<number>) => {
      state.liveRoomTimestamps = action.payload;
    },
  },
});

export const {
  setLiveRoom,
  setCurrentSong,
  setRemoveLiveRoom,
  setNoOfJoinedUsers,
  setJoinedUsersTimestamps,
  setLiveRoomTimestamps,
} = liveRoomState.actions;
export default liveRoomState.reducer;

// selectors
export const selectLiveRoom = (state: RootState) => {
  return state.liveRoom.liveRoom;
};

export const selectLiveRoomCurrent = (state: RootState) => {
  return state.liveRoom.liveRoom?.currentSong;
};
export const selectRoomType = (state: RootState) => {
  return state.liveRoom.roomType;
};
export const selectNoOfJoinedUser = (state: RootState) => {
  return state.liveRoom.noOfJoinedUsers;
};
export const selectJoinedusersTimestamps = (state: RootState) => {
  return state.liveRoom.joinedUsersTimestamps;
};
