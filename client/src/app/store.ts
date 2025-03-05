import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import roomReducer from "../features/room/room.slice";
import liveRoomReducer from "../features/liveRoom/liveRoom.slice";
import songReducer from "../features/song/song.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    room: roomReducer,
    liveRoom: liveRoomReducer,
    song: songReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
