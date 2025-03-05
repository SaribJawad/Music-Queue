import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LiveRoomType } from "../../schemas/roomSchema";
import { RootState } from "../../app/store";
import { SongType } from "../../schemas/songSchema";

interface ILiveRoomState {
  liveRoom: LiveRoomType | null;
  roomType: "youtube" | "soundcloud" | null;
}

const initialState: ILiveRoomState = {
  liveRoom: null,
  roomType: null,
};

export const liveRoomState = createSlice({
  name: "liveRoom",
  initialState,
  reducers: {
    setLiveRoom: (state, action: PayloadAction<LiveRoomType>) => {
      state.liveRoom = action.payload;
      state.roomType = action.payload.roomType;
    },
    setCurrentSong: (state, action: PayloadAction<SongType>) => {
      state!.liveRoom!.currentSong = action.payload;
    },
  },
});

export const { setLiveRoom, setCurrentSong } = liveRoomState.actions;
export default liveRoomState.reducer;

// selectors
export const selectLiveRoom = (state: RootState) => {
  return state.liveRoom.liveRoom;
};
export const selectRoomType = (state: RootState) => {
  return state.liveRoom.roomType;
};
