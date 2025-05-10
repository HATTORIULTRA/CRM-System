import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError, AxiosResponse } from "axios";
import { KnownError } from "../../types/auth.ts";
import instance from "../../api/axios.ts";
import { User, IGetAllUsers, UserRequest, Roles } from "../../types/admin.ts";

interface IAdminState {
  users: User[];
  usersAmount: number;
  userProfile: User | null;
  isLoading: boolean;
}

const initialState: IAdminState = {
  users: [],
  usersAmount: 0,
  userProfile: null,
  isLoading: false,
};

export const getAllUsers = createAsyncThunk<
  AxiosResponse<User[]>,
  IGetAllUsers
>("admin/getAllUsers", async (filters, { rejectWithValue }) => {
  try {
    const { searchValue, isBlocked, sortBy, sortOrder, limit, offset } =
      filters || {};
    const res = await instance.get(`/admin/users`, {
      params: {
        search: searchValue,
        sortBy: sortBy,
        sortOrder: sortOrder,
        isBlocked: isBlocked,
        limit: limit,
        offset: offset,
      },
    });
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

export const getUserByID = createAsyncThunk<AxiosResponse<User>, number>(
  "admin/getUserByID",
  async (userId: number, { rejectWithValue }) => {
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
  }
);

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
  { userId: number; values: UserRequest }
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

export const updateUserRoles = createAsyncThunk<
  AxiosResponse<User>,
  { userId: number; roles: Roles[] }
>("admin/updateUserRoles", async ({ userId, roles }, { rejectWithValue }) => {
  try {
    return await instance.post(`/admin/users/${userId}/rights`, { roles });
  } catch (err: any) {
    const error: AxiosError<KnownError> = err;
    if (!error.response) {
      throw err;
    }
    console.log(rejectWithValue(error.response));
    return rejectWithValue(error.response);
  }
});

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
        //@ts-ignore
        state.usersAmount = action.payload.meta.totalAmount;
        state.isLoading = false;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isLoading = false;
      })

      // GET USER PROFILE
      .addCase(getUserByID.pending, (state) => {
        state.userProfile = null;
        state.isLoading = true;
      })
      .addCase(getUserByID.fulfilled, (state, action) => {
        console.log(action.payload.data);

        state.userProfile = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getUserByID.rejected, (state) => {
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
