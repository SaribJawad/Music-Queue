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
      state.songQueue.push(action.payload);
    },
    setRemoveSong: (state, action: PayloadAction<string>) => {
      state.songQueue = state.songQueue.filter(
        (song) => song._id !== action.payload
      );
    },
    setEmptySongQueue: (state) => {
      state.songQueue = [];
    },
    setUpvoteSong: (
      state,
      action: PayloadAction<{ userId: string; songId: string }>
    ) => {
      state.songQueue = state.songQueue
        .map((song) =>
          song._id === action.payload.songId
            ? song.vote.includes(action.payload.userId)
              ? {
                  ...song,
                  noOfVote: song.noOfVote - 1,
                  vote: song.vote.filter(
                    (voteId) => voteId !== action.payload.userId
                  ),
                }
              : {
                  ...song,
                  noOfVote: song.noOfVote + 1,
                  vote: [...song.vote, action.payload.userId],
                }
            : song
        )
        .sort((a, b) => b.noOfVote - a.noOfVote);
    },
  },
});

export const {
  setSongQueue,
  updateSongQueue,
  setRemoveSong,
  setEmptySongQueue,
  setUpvoteSong,
} = songSlice.actions;
export default songSlice.reducer;

// selector
export const selectSongQueue = (state: RootState) => {
  return state.song.songQueue;
};
