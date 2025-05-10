import { AxiosError } from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";

import instance from "../../api/axios.ts";
import {
  AuthData,
  AxiosResponse,
  IAuthState,
  KnownError,
  Profile,
  Token,
  UserRegistration,
} from "../../types/auth.ts";
import tokenHelper from "../../helpers/token.helper.ts";

const initialState: IAuthState = {
  user: null,
  isLoading: false,
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
      const res = await instance.post("/auth/signup", {
        email,
        login,
        password,
        phoneNumber,
        username,
      });

      notification.config({ maxCount: 3 });
      notification.success({
        message: "Успех",
        description: "Вы успешно зарегистрировались.",
        placement: "bottomRight",
        duration: 4,
      });

      return res;
    } catch (err: any) {
      const error: AxiosError<KnownError> = err;
      if (!error.response) {
        throw err;
      }

      if (error.response.status === 500) {
        notification.config({ maxCount: 3 });
        notification.error({
          message: "Упс",
          description: "Ошибка сервера, повторите попытку.",
          placement: "bottomRight",
          duration: 4,
        });
      } else if (error.response.status === 409) {
        notification.config({ maxCount: 3 });
        notification.error({
          message: "Ошибка",
          description: "Такой пользователь уже существует!",
          placement: "bottomRight",
          duration: 4,
        });
      }

      console.log(rejectWithValue(error.response));
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
    const res = await instance.post("/auth/signin", {
      login,
      password,
    });

    notification.config({ maxCount: 3 });
    notification.success({
      message: "Успех",
      description: "Вы авторизовались!",
      placement: "bottomRight",
      duration: 3,
    });

    return res;
  } catch (err: any) {
    const error: AxiosError<KnownError> = err;
    if (!error.response) {
      throw err;
    }

    if (error.response.status === 401) {
      notification.config({ maxCount: 3 });
      notification.error({
        message: "Ошибка",
        description: "Неверные данные пользователя.",
        placement: "bottomRight",
        duration: 4,
      });
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
        tokenHelper.tokenFromHelper.refreshToken;

      const res = await instance.post("/auth/refresh", { refreshToken });

      return res.data;
    } catch (err: any) {
      const error: AxiosError<KnownError> = err;
      if (!error.response) {
        throw err;
      }
      console.log(rejectWithValue(error.response));
      return rejectWithValue(error.response);
    }
  }
);

export const getUserProfile = createAsyncThunk<Profile>(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await instance.get("/user/profile");
      return res.data;
    } catch (err: any) {
      const error: AxiosError<KnownError> = err;
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
  } catch (err: any) {
    const error: AxiosError<KnownError> = err;
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
  reducers: {},
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
      })

      // LOGIN USER
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.isLoading = false;
        state.isAuth = true;
        tokenHelper.accessToken = action.payload.data.accessToken;
        tokenHelper.refreshTokenToLocalStorage =
          action.payload.data.refreshToken;
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
        state.status = action.payload.status;
        state.isAuth = true;
        tokenHelper.accessToken = action.payload.accessToken;
        tokenHelper.refreshTokenToLocalStorage = action.payload.refreshToken;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuth = false;
        tokenHelper.removeRefreshTokenFromLS();
      })

      // GET ME
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.isLoading = false;
      })

      //LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false;
        state.user = null;
        state.isLoading = false;
        state.status = null;
        tokenHelper.accessToken = null;
        tokenHelper.removeRefreshTokenFromLS();
      });
  },
});

export default authSlice.reducer;
