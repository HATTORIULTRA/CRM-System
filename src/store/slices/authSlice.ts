import { AxiosError } from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import instance, { API_URL } from "../../api/axios.ts";
import {
  AuthData,
  AxiosResponse,
  IAuthState,
  KnownError,
  Profile,
  Token,
  UserRegistration,
} from "../../types/IAuth.ts";
import TokenHelper from "../../helpers/localStorage.helper.ts";

const tokenHelper = new TokenHelper();

const initialState: IAuthState = {
  user: null,
  isLoading: false,
  token: null,
  isAuth: false,
  status: null,
};

export const registerUser = createAsyncThunk<
  AxiosResponse<Profile>,
  UserRegistration,
  { rejectValue: AxiosResponse<KnownError> | undefined }
>(
  "auth/registerUser",
  async (
    { email, login, password, phoneNumber, username },
    { rejectWithValue }
  ) => {
    try {
      return await instance.post("/auth/signup", {
        email,
        login,
        password,
        phoneNumber,
        username,
      });
    } catch (err) {
      const error: AxiosError<KnownError> = err as any;
      console.log(error.response);
      return rejectWithValue(error.response);
    }
  }
);

export const loginUser = createAsyncThunk<
  AxiosResponse<Token>,
  AuthData,
  { rejectValue: AxiosResponse<KnownError> }
>("auth/loginUser", async ({ login, password }, { rejectWithValue }) => {
  try {
    return await instance.post("/auth/signin", {
      login,
      password,
    });
  } catch (err) {
    const error: AxiosError<KnownError> = err as any;
    if (!error.response) {
      throw err;
    }
    console.log(rejectWithValue(error.response));
    return rejectWithValue(error.response);
  }
});

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken: string | null =
        tokenHelper.getTokenFromLocalStorage().refreshToken;
      const res = await instance.post(`${API_URL}/auth/refresh`, {
        refreshToken,
      });
      return res.data;
    } catch (err) {
      const error: AxiosError<KnownError> = err as any;
      if (!error.response) {
        throw err;
      }
      console.log(rejectWithValue(error.response));
      return rejectWithValue(error.response);
    }
  }
);

export const getMe = createAsyncThunk<Profile>(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await instance.get("/user/profile");
      return res.data;
    } catch (err) {
      const error: AxiosError<KnownError> = err as any;
      if (!error.response) {
        throw err;
      }
      console.log(rejectWithValue(error.response));
      return rejectWithValue(error.response);
    }
  }
);

export const logoutUser = createAsyncThunk<
  AxiosResponse<string>,
  void,
  { rejectValue: AxiosResponse<KnownError> }
>("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    const res = await instance.post("/user/logout");
    return res.data;
  } catch (err) {
    const error: AxiosError<KnownError> = err as any;
    if (!error.response) {
      throw err;
    }
    console.log(rejectWithValue(error.response));
    return rejectWithValue(error.response);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetStatus(state) {
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER USER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = action.payload.status;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.status = action.payload!.status;
        console.log(action.payload);
      })

      // LOGIN USER
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.isLoading = false;
        state.token = action.payload.data.accessToken;
        state.isAuth = true;
        tokenHelper.setTokenToLocalStorage(
          "accessToken",
          action.payload.data.accessToken
        );
        tokenHelper.setTokenToLocalStorage(
          "refreshToken",
          action.payload.data.refreshToken
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.status = action.payload!.status;
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.accessToken;
        state.status = action.payload.status;
        state.isAuth = true;

        tokenHelper.setTokenToLocalStorage(
          "accessToken",
          action.payload.accessToken
        );
        tokenHelper.setTokenToLocalStorage(
          "refreshToken",
          action.payload.refreshToken
        );
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuth = false;
        tokenHelper.removeTokenFromLocalStorage("accessToken");
        tokenHelper.removeTokenFromLocalStorage("refreshToken");
      })

      // GET ME
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state) => {
        state.token = null;
      })

      //LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false;
        state.user = null;
        state.isLoading = false;
        state.token = null;
        state.status = null;
        tokenHelper.removeTokenFromLocalStorage("accessToken");
        tokenHelper.removeTokenFromLocalStorage("refreshToken");
      });
  },
});

export const { resetStatus } = authSlice.actions;

export default authSlice.reducer;
