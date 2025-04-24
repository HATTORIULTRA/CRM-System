import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError, AxiosResponse } from "axios";
import { KnownError } from "../../types/IAuth.ts";
import instance from "../../api/axios.ts";
import {
  IAdminState,
  IUpdateUserProfile,
  User,
  IAddRoleToUser,
  IGetAllUsers,
} from "../../types/IAdmin.ts";

const initialState: IAdminState = {
  users: [],
  userProfile: null,
  isLoading: false,
};

export const getAllUsers = createAsyncThunk<
  AxiosResponse<User[]>,
  IGetAllUsers
>("admin/getAllUsers", async (querys, { rejectWithValue }) => {
  try {
    const {
      searchValue = "",
      isBlocked = "",
      sortBy = "",
      sortOrder = "",
    } = querys || {};
    const res = await instance.get(
      `/admin/users?limit=1000&search=${searchValue}&isBlocked=${isBlocked}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
    console.log(res.data);
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

export const retrieveUsersProfile = createAsyncThunk<
  AxiosResponse<User>,
  number
>("admin/retrieveUsersProfile", async (userId: number, { rejectWithValue }) => {
  try {
    return await instance.get(`/admin/users/${userId}`);
  } catch (err: any) {
    const error: AxiosError<KnownError> = err;
    if (!error.response) {
      throw err;
    }
    console.log(rejectWithValue(error.response));
    return rejectWithValue(error.response);
  }
});

export const removeUser = createAsyncThunk<AxiosResponse<string>, number>(
  "admin/removeUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await instance.delete(`/admin/users/${userId}`);
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

export const blockUser = createAsyncThunk<AxiosResponse<string>, number>(
  "admin/blockUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await instance.post(`/admin/users/${userId}/block`);
      console.log(res.data);
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

export const unlockUser = createAsyncThunk<AxiosResponse<string>, number>(
  "admin/unlockUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await instance.post(`/admin/users/${userId}/unblock`);
      console.log(res.data);
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

export const updateUserProfile = createAsyncThunk<
  AxiosResponse<User>,
  IUpdateUserProfile
>(
  "admin/updateUserProfile",
  async ({ userId, values }, { rejectWithValue }) => {
    try {
      return instance.put(`/admin/users/${userId}`, values);
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

export const addRoleToUser = createAsyncThunk<
  AxiosResponse<User>,
  IAddRoleToUser
>("admin/addRoleToUser", async ({ userId, newRole }, { rejectWithValue }) => {
  try {
    const userData = await instance.get(`/admin/users/${userId}`);
    const userRoles = userData.data.roles;

    return await instance.post(`/admin/users/${userId}/rights`, {
      roles: [...userRoles, newRole],
    });
  } catch (err: any) {
    const error: AxiosError<KnownError> = err;
    if (!error.response) {
      throw err;
    }
    console.log(rejectWithValue(error.response));
    return rejectWithValue(error.response);
  }
});

export const resetUserRoles = createAsyncThunk<AxiosResponse<string>, number>(
  "admin/resetUserRoles",
  async (userId, { rejectWithValue }) => {
    try {
      return instance.post(`/admin/users/${userId}/rights`, {
        roles: ["USER"],
      });
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

export const adminSLice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // GET ALL USERS
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isLoading = false;
      })

      // GET USER PROFILE
      .addCase(retrieveUsersProfile.pending, (state) => {
        state.userProfile = null;
        state.isLoading = true;
      })
      .addCase(retrieveUsersProfile.fulfilled, (state, action) => {
        console.log(action.payload.data);

        state.userProfile = action.payload.data;
        state.isLoading = false;
      })
      .addCase(retrieveUsersProfile.rejected, (state) => {
        state.userProfile = null;
        state.isLoading = false;
      })

      // REMOVE USER
      .addCase(removeUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(removeUser.rejected, (state) => {
        state.isLoading = false;
      })

      // BLOCK USER
      .addCase(blockUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(blockUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(blockUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default adminSLice.reducer;
