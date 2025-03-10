import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LiveRoomType } from "../../schemas/roomSchema";
import { RootState } from "../../app/store";
import { SongType } from "../../schemas/songSchema";

interface ILiveRoomState {
  liveRoom: LiveRoomType | undefined;
  roomType: "youtube" | "soundcloud" | undefined;
  noOfJoinedUsers: number;
  playerStatus: {
    status: 1 | 2;
    timestamps: number;
  };
}

const initialState: ILiveRoomState = {
  liveRoom: undefined,
  roomType: undefined,
  noOfJoinedUsers: 0,
  playerStatus: {
    status: 2,
    timestamps: 0,
  },
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
    setPlayerStatus: (
      state,
      action: PayloadAction<{ status: 1 | 2; timestamps: number }>
    ) => {
      state.playerStatus = action.payload;
    },
  },
});

export const {
  setLiveRoom,
  setCurrentSong,
  setRemoveLiveRoom,
  setNoOfJoinedUsers,
  setPlayerStatus,
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
export const selectPlayerStatus = (state: RootState) => {
  return state.liveRoom.playerStatus;
};
