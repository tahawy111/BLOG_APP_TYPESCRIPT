import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IUserLogin } from "../components/auth/LoginPass";
import { toast } from "react-toastify";
import { IUserRegister } from "../components/auth/RegisterForm";
import { IBlogs, IFacebookLoginPayload } from "../utils/TypeScript";
import axios from "axios";

export interface AuthState {
  loading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  user: any;
  userBlogs: null | {
    blogs: IBlogs[];
    total: number;
  };
}

export const login = createAsyncThunk(
  "auth/login",
  async (user: IUserLogin, thunkAPI) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/login`, user);
      return thunkAPI.fulfillWithValue(res.data);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.msg ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (user: IUserRegister, thunkAPI) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/register`,
        user
      );
      return thunkAPI.fulfillWithValue(res.data);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.msg ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (id_token: string, thunkAPI) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/google_login`,
        {
          id_token,
        }
      );
      return thunkAPI.fulfillWithValue(res.data);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.msg ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const facebookLogin = createAsyncThunk(
  "auth/facebookLogin",
  async (payload: IFacebookLoginPayload, thunkAPI) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/facebook_login`,
        payload
      );
      return thunkAPI.fulfillWithValue(res.data);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.msg ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const activeAccount = createAsyncThunk(
  "auth/activeAccount",
  async (token: string, thunkAPI) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/active`, {
        active_token: token,
      });
      return thunkAPI.fulfillWithValue(res.data);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.msg ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const update = createAsyncThunk(
  "auth/update",
  async (
    user: {
      name: string;
      account: string;
      avatar: File | string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.patch(`${process.env.REACT_APP_API}/user`, user, {
        headers: { authorization: JSON.parse(localStorage.user).access_token },
      });
      return thunkAPI.fulfillWithValue(res.data);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.msg ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    user: {
      oldPassword: string;
      password: string;
      password2: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/resetPassword`,
        user
      );
      return thunkAPI.fulfillWithValue(res.data);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.msg ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const changeEmail = createAsyncThunk(
  "auth/changeEmail",
  async (token: string, thunkAPI) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/confirmChangeEmail`,
        {
          active_token: token,
        },
        {
          headers: {
            authorization: JSON.parse(localStorage.user).access_token,
          },
        }
      );
      return thunkAPI.fulfillWithValue(res.data);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.msg ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState: AuthState = {
  loading: false,
  isSuccess: localStorage.user ? true : false,
  isError: false,
  message: "",
  user: localStorage.user ? JSON.parse(localStorage.user) : null,
  userBlogs: null,
};

export const getBlogsByUserId = createAsyncThunk(
  "auth/getBlogsByUserId",
  async (
    obj: { userId: string; page?: number | 1; limit?: number },
    thunkAPI
  ) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/blog/user/${obj.userId}?page=${obj.page}${
          obj.limit ? `&limit=${obj.limit}` : ""
        }`
      );
      return thunkAPI.fulfillWithValue(res.data);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.msg ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      return {
        ...state,
        loading: false,
        isSuccess: false,
        isError: false,
        message: "",
        user: null,
      };
    },
    loading: (state) => {
      return {
        ...state,
        loading: true,
      };
    },
    logout: (state) => {
      localStorage.removeItem("user");
      toast.success("You Logged Out Succcessfully");
      return {
        ...state,
        loading: false,
        isSuccess: false,
        isError: false,
        message: "",
        user: null,
      };
    },
  },

  extraReducers: (builder: any) => {
    builder.addCase(login.pending, (state: AuthState) => {
      return { ...state, loading: true };
    });
    builder.addCase(login.fulfilled, (state: AuthState, action: any) => {
      localStorage.user = JSON.stringify(action.payload);
      toast.success(`${action.payload.msg}`);
      return {
        ...state,
        loading: false,
        isSuccess: true,
        user: action.payload,
      };
    });
    builder.addCase(
      login.rejected,
      (state: AuthState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload,
          user: null,
        };
      }
    );

    builder.addCase(register.pending, (state: AuthState) => {
      return { ...state, loading: true };
    });
    builder.addCase(register.fulfilled, (state: AuthState, action: any) => {
      toast.success(`${action.payload.msg}`);
      return {
        ...state,
        loading: false,
        isSuccess: true,
      };
    });

    builder.addCase(
      register.rejected,
      (state: AuthState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload,
          user: null,
        };
      }
    );
    builder.addCase(googleLogin.pending, (state: AuthState) => {
      return { ...state, loading: true };
    });
    builder.addCase(googleLogin.fulfilled, (state: AuthState, action: any) => {
      localStorage.user = JSON.stringify(action.payload);
      toast.success(`${action.payload.msg}`);
      return {
        ...state,
        loading: false,
        isSuccess: true,
        user: action.payload,
      };
    });
    builder.addCase(
      googleLogin.rejected,
      (state: AuthState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload,
          user: null,
        };
      }
    );
    builder.addCase(facebookLogin.pending, (state: AuthState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      facebookLogin.fulfilled,
      (state: AuthState, action: any) => {
        localStorage.user = JSON.stringify(action.payload);
        toast.success(`${action.payload.msg}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          user: action.payload,
        };
      }
    );
    builder.addCase(
      facebookLogin.rejected,
      (state: AuthState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload,
          user: null,
        };
      }
    );
    builder.addCase(activeAccount.pending, (state: AuthState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      activeAccount.fulfilled,
      (state: AuthState, action: any) => {
        toast.success(`${action.payload.msg}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload.msg,
        };
      }
    );
    builder.addCase(
      activeAccount.rejected,
      (state: AuthState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload,
          user: null,
        };
      }
    );
    builder.addCase(update.pending, (state: AuthState) => {
      return { ...state, loading: true };
    });
    builder.addCase(update.fulfilled, (state: AuthState, action: any) => {
      const userVar = {
        user: action.payload.user || state.user.user,
        access_token: state.user?.access_token,
      };
      toast.success(`${action.payload.msg}`);
      localStorage.setItem("user", JSON.stringify(userVar));
      return {
        ...state,
        loading: false,
        isSuccess: true,
        user: userVar,
        message: action.payload.msg,
      };
    });
    builder.addCase(
      update.rejected,
      (state: AuthState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload,
          user: null,
        };
      }
    );
    builder.addCase(resetPassword.pending, (state: AuthState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      resetPassword.fulfilled,
      (state: AuthState, action: any) => {
        const userVar = {
          user: action.payload.user,
          access_token: state.user?.access_token,
        };
        toast.success(`${action.payload.msg}`);
        localStorage.setItem("user", JSON.stringify(userVar));
        return {
          ...state,
          loading: false,
          isSuccess: true,
          user: userVar,
          message: action.payload.msg,
        };
      }
    );
    builder.addCase(
      resetPassword.rejected,
      (state: AuthState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload,
          user: null,
        };
      }
    );
    builder.addCase(changeEmail.pending, (state: AuthState) => {
      return { ...state, loading: true };
    });
    builder.addCase(changeEmail.fulfilled, (state: AuthState, action: any) => {
      const userVar = {
        user: action.payload.user,
        access_token: state.user?.access_token,
      };
      toast.success(`${action.payload.msg}`);
      localStorage.setItem("user", JSON.stringify(userVar));
      return {
        ...state,
        loading: false,
        isSuccess: true,
        user: userVar,
        message: action.payload.msg,
      };
    });
    builder.addCase(
      changeEmail.rejected,
      (state: AuthState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload,
          user: null,
        };
      }
    );
    builder.addCase(getBlogsByUserId.pending, (state: AuthState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      getBlogsByUserId.fulfilled,
      (state: AuthState, action: any) => {
        return {
          ...state,
          loading: false,
          isSuccess: true,
          userBlogs: action.payload,
        };
      }
    );
    builder.addCase(
      getBlogsByUserId.rejected,
      (state: AuthState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: false,
          message: action.payload,
        };
      }
    );
  },
});

// Action creators are generated for each case reducer function
export const { reset, logout, loading } = authSlice.actions;

export default authSlice.reducer;
