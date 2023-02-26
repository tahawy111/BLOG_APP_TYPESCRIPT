import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { IBlog, IBlogs, ICreateBlogProps } from "../utils/TypeScript";
import axios from "axios";

export const createBlog = createAsyncThunk(
  "blog/create",
  async (payload: ICreateBlogProps, thunkAPI) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/blog`,
        payload,
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

export const getBlogs = createAsyncThunk(
  "blog/getBlogs",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/blog`);
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

export const getBlogsByCategoryId = createAsyncThunk(
  "blog/getBlogsByCategoryId",
  async (
    obj: { catId: string; page?: number | 1; limit?: number },
    thunkAPI
  ) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/blog/${obj.catId}?page=${obj.page}${
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

export interface BlogState {
  loading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  blogs: null | IBlog[];
  blogsByCat: null | {
    blogs: IBlogs[];
    total: number;
  };
}

const initialState: BlogState = {
  loading: false,
  isSuccess: false,
  isError: false,
  message: "",
  blogs: null,
  blogsByCat: null,
};

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    reset: (state) => {
      return {
        ...state,
        loading: false,
        isSuccess: false,
        isError: false,
        message: "",
        blogs: null,
        blogsByCat: null,
      };
    },
  },

  extraReducers: (builder: any) => {
    builder.addCase(createBlog.pending, (state: BlogState) => {
      return { ...state, loading: true };
    });
    builder.addCase(createBlog.fulfilled, (state: BlogState, action: any) => {
      toast.success(`${action.payload.msg}`);
      return {
        ...state,
        loading: false,
        isSuccess: true,
        blogs: action.payload.blogs,
      };
    });
    builder.addCase(
      createBlog.rejected,
      (state: BlogState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: false,
          message: action.payload,
        };
      }
    );
    builder.addCase(getBlogs.pending, (state: BlogState) => {
      return { ...state, loading: true };
    });
    builder.addCase(getBlogs.fulfilled, (state: BlogState, action: any) => {
      return {
        ...state,
        loading: false,
        isSuccess: true,
        blogs: action.payload.blogs,
      };
    });
    builder.addCase(
      getBlogs.rejected,
      (state: BlogState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: false,
          message: action.payload,
        };
      }
    );
    builder.addCase(getBlogsByCategoryId.pending, (state: BlogState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      getBlogsByCategoryId.fulfilled,
      (state: BlogState, action: any) => {
        return {
          ...state,
          loading: false,
          isSuccess: true,
          blogsByCat: {
            ...state.blogsByCat,
            blogs: action.payload.blogs,
            total: action.payload.total,
            count: action.payload.count,
          },
        };
      }
    );
    builder.addCase(
      getBlogsByCategoryId.rejected,
      (state: BlogState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: false,
          message: action.payload,
        };
      }
    );
    // builder.addCase(getDetailBlog.pending, (state: BlogState) => {
    //   return { ...state, loading: true };
    // });
    // builder.addCase(
    //   getDetailBlog.fulfilled,
    //   (state: BlogState, action: PayloadAction) => {
    //     return {
    //       ...state,
    //       loading: false,
    //       isSuccess: true,
    //       blog: action.payload,
    //     };
    //   }
    // );
    // builder.addCase(
    //   getDetailBlog.rejected,
    //   (state: BlogState, action: PayloadAction) => {
    //     toast.error(`${action.payload}`);
    //     return {
    //       ...state,
    //       loading: false,
    //       isSuccess: false,
    //       message: action.payload,
    //     };
    //   }
    // );
  },
});

export const { reset } = blogSlice.actions;

export default blogSlice.reducer;
