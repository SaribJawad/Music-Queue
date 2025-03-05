import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SongType } from "../../schemas/songSchema";
import { RootState } from "../../app/store";

interface SongState {
  songQueue: SongType[];
}

const initialState: SongState = {
  songQueue: [],
};

export const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    setSongQueue: (state, action: PayloadAction<SongType[]>) => {
      state.songQueue = [...action.payload].sort(
        (a, b) => b.noOfVote - a.noOfVote
      );
    },
    updateSongQueue: (state, action: PayloadAction<SongType>) => {
      //   state.songQueue.push(action.payload);
      state.songQueue = [...state.songQueue, action.payload].sort(
        (a, b) => b.noOfVote - a.noOfVote
      );
    },
  },
});

export const { setSongQueue, updateSongQueue } = songSlice.actions;
export default songSlice.reducer;

// selector
export const selectSongQueue = (state: RootState) => {
  return state.song.songQueue;
};
