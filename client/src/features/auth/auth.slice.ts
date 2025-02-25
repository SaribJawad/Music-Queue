import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSchema } from "../../schemas/userSchema";
import { z } from "zod";
import { RootState } from "../../app/store";

export type UserType = z.infer<typeof UserSchema>;

interface AuthState {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  userInfo: UserType | null;
  isLive: boolean;
  authError: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userInfo: null,
  isAuthLoading: false,
  isLive: false,
  authError: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthStart: (state) => {
      state.isAuthenticated = false;
      state.isAuthLoading = true;
      state.authError = null;
    },
    setAuthSuccess: (state, action: PayloadAction<UserType>) => {
      const parsedUser = UserSchema.parse(action.payload);
      state.isAuthenticated = true;
      state.userInfo = parsedUser;
      state.isAuthLoading = false;
      state.isLive = parsedUser.isAlive;
      state.authError = null;
    },
    setAuthFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.isAuthLoading = false;
      state.authError = action.payload;
    },
  },
});

export const { setAuthStart, setAuthSuccess, setAuthFailure } =
  authSlice.actions;

export default authSlice.reducer;

// selectors

export const selectUserInfo = (state: RootState) => state.auth.userInfo;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
