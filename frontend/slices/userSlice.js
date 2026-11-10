import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseurl from "../store/baseurl";

const getInitialUser = () => {
  if (typeof window !== "undefined") {
    try {
      const storedUser = localStorage.getItem("aptus_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      return null;
    }
  }
  return null;
};

const getAuthHeaders = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("aptus_token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
};

const initialState = {
  error: "",
  loading: false,
  isUserRegistered: false,
  isUserLogged: false,
  user: getInitialUser(),
  isTokenGenerated: false,
  isBusinessDetailsAdded: false,
  isBusinessDetailsUpdated: false,
  isBusinessDetailsDeleted: false,
  isLoggedOut: false,
  isInitialized: false,
};

// signup user
export const signUp = createAsyncThunk(
  "user/signUp",
  async (payload, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.post(`${baseurl}/user/register`, payload, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// login user
export const login = createAsyncThunk(
  "user/login",
  async (payload, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.post(`${baseurl}/user/login`, payload, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// logout user
export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.get(`${baseurl}/user/logout`, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// load user
export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.get(`${baseurl}/user/me`, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });
      return fulfillWithValue(data.user);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// generate new token
export const generateNewToken = createAsyncThunk(
  "user/generateNewToken",
  async (payload, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.post(`${baseurl}/user/token`, payload, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// add business details
export const addBusinessDetails = createAsyncThunk(
  "user/addBusinessDetails",
  async (payload, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.post(`${baseurl}/user/bussinessDetails`, payload, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// update business details
export const updateBusinessDetails = createAsyncThunk(
  "user/updateBusinessDetails",
  async ({ id, question, answer }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.put(
        `${baseurl}/user/businessDetails/${id}`,
        { question, answer },
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// delete business details
export const deleteBusinessDetails = createAsyncThunk(
  "user/deleteBusinessDetails",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.delete(`${baseurl}/user/businessDetails/${id}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearState: (state) => {
      state.error = "";
      state.isUserRegistered = false;
      state.isUserLogged = false;
      state.isTokenGenerated = false;
      state.isBusinessDetailsAdded = false;
      state.isBusinessDetailsUpdated = false;
      state.isBusinessDetailsDeleted = false;
      state.isLoggedOut = false;
    },
  },
  extraReducers: (builder) => {
    // user signup
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      state.isUserRegistered = true;
      if (action.payload?.user) {
        state.user = action.payload.user;
        state.isInitialized = true;
        if (typeof window !== "undefined") {
          localStorage.setItem("aptus_user", JSON.stringify(action.payload.user));
          if (action.payload?.token) {
            localStorage.setItem("aptus_token", action.payload.token);
          }
        }
      }
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || "Something went wrong";
    });

    // user login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isUserLogged = true;
      if (action.payload?.user) {
        state.user = action.payload.user;
        state.isInitialized = true;
        if (typeof window !== "undefined") {
          localStorage.setItem("aptus_user", JSON.stringify(action.payload.user));
          if (action.payload?.token) {
            localStorage.setItem("aptus_token", action.payload.token);
          }
        }
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload?.message;
    });

    // load user
    builder.addCase(loadUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isInitialized = true;
      if (typeof window !== "undefined" && action.payload) {
        localStorage.setItem("aptus_user", JSON.stringify(action.payload));
      }
    });
    builder.addCase(loadUser.rejected, (state) => {
      state.loading = false;
      state.isInitialized = true;
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("aptus_user");
      }
    });

    // generate new token
    builder.addCase(generateNewToken.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(generateNewToken.fulfilled, (state) => {
      state.loading = false;
      state.isTokenGenerated = true;
    });
    builder.addCase(generateNewToken.rejected, (state) => {
      state.loading = false;
    });

    // add business details
    builder.addCase(addBusinessDetails.pending, (state) => {
      state.loading = true;
      state.isBusinessDetailsAdded = false;
    });
    builder.addCase(addBusinessDetails.fulfilled, (state) => {
      state.loading = false;
      state.isBusinessDetailsAdded = true;
    });
    builder.addCase(addBusinessDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload?.message;
      state.isBusinessDetailsAdded = false;
    });

    // update business details
    builder.addCase(updateBusinessDetails.pending, (state) => {
      state.loading = true;
      state.isBusinessDetailsUpdated = false;
    });
    builder.addCase(updateBusinessDetails.fulfilled, (state) => {
      state.loading = false;
      state.isBusinessDetailsUpdated = true;
    });
    builder.addCase(updateBusinessDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload?.message;
      state.isBusinessDetailsUpdated = false;
    });

    // delete business details
    builder.addCase(deleteBusinessDetails.pending, (state) => {
      state.loading = true;
      state.isBusinessDetailsDeleted = false;
    });
    builder.addCase(deleteBusinessDetails.fulfilled, (state) => {
      state.loading = false;
      state.isBusinessDetailsDeleted = true;
    });
    builder.addCase(deleteBusinessDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.payload?.message;
    });

    // logout user
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.isUserLogged = false;
      state.isLoggedOut = true;
      state.isInitialized = true;
      if (typeof window !== "undefined") {
        localStorage.removeItem("aptus_user");
        localStorage.removeItem("aptus_token");
      }
    });
    builder.addCase(logout.rejected, (state) => {
      state.loading = false;
      state.user = null;
      state.isUserLogged = false;
      state.isLoggedOut = true;
      state.isInitialized = true;
      if (typeof window !== "undefined") {
        localStorage.removeItem("aptus_user");
        localStorage.removeItem("aptus_token");
      }
    });
  },
});

export default userReducer.reducer;
export const { clearState } = userReducer.actions;
