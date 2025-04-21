import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isAuthenticated: boolean;
  token: string | null;
  tokenExpiration: number | null;
  email: string | null;
  userId: string | null;
  role: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  token: null,
  tokenExpiration: null,
  email: null,
  userId: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        token: string;
        tokenExpiration: number;
        email: string;
        userId: string;
        role: string
      }>
    ) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.tokenExpiration = action.payload.tokenExpiration;
      state.email = action.payload.email;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
    },
    logout: () => initialState,
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
