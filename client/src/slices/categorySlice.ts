import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ICategory } from "../utils/TypeScript";
import axios from "axios";

export const createCategory = createAsyncThunk(
  "category/create",
  async (name: string, thunkAPI) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/category`,
        { name },
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
export const getCategory = createAsyncThunk(
  "category/get",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/category`);
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

export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ name, _id }: ICategory, thunkAPI) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API}/category/${_id}`,
        { name },
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
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id: string, thunkAPI) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/category/${id}`,
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

export interface CategoryState {
  loading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  categories: any;
}

const initialState: CategoryState = {
  loading: false,
  isSuccess: false,
  isError: false,
  message: "",
  categories: null,
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    reset: (state) => {
      return {
        ...state,
        loading: false,
        isSuccess: false,
        isError: false,
        message: "",
        categories: null,
      };
    },
  },

  extraReducers: (builder: any) => {
    builder.addCase(createCategory.pending, (state: CategoryState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      createCategory.fulfilled,
      (state: CategoryState, action: any) => {
        toast.success(`${action.payload.msg}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          categories: action.payload.categories,
        };
      }
    );
    builder.addCase(
      createCategory.rejected,
      (state: CategoryState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: false,
          message: action.payload,
        };
      }
    );
    builder.addCase(getCategory.pending, (state: CategoryState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      getCategory.fulfilled,
      (state: CategoryState, action: any) => {
        return {
          ...state,
          loading: false,
          isSuccess: true,
          categories: action.payload.categories,
        };
      }
    );
    builder.addCase(
      getCategory.rejected,
      (state: CategoryState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: false,
          message: action.payload,
        };
      }
    );

    builder.addCase(updateCategory.pending, (state: CategoryState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      updateCategory.fulfilled,
      (state: CategoryState, action: any) => {
        toast.success(`${action.payload.msg}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          categories: action.payload.categories,
        };
      }
    );
    builder.addCase(
      updateCategory.rejected,
      (state: CategoryState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: false,
          message: action.payload,
        };
      }
    );
    builder.addCase(deleteCategory.pending, (state: CategoryState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      deleteCategory.fulfilled,
      (state: CategoryState, action: any) => {
        toast.success(`${action.payload.msg}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          categories: action.payload.categories,
        };
      }
    );
    builder.addCase(
      deleteCategory.rejected,
      (state: CategoryState, action: PayloadAction) => {
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

export const { reset } = categorySlice.actions;

export default categorySlice.reducer;
