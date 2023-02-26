import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { IComment } from "../utils/TypeScript";
import axios from "axios";

export const createComment = createAsyncThunk(
  "comment/createComment",
  async (comment: IComment, thunkAPI) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/comment/`,
        comment,
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
export const fetchComments = createAsyncThunk(
  "comment/fetchComments",
  async (blog_id: string | undefined, thunkAPI) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/comments/blog/${blog_id}`
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
export const replyComment = createAsyncThunk(
  "comment/replyComment",
  async (comment: IComment | undefined, thunkAPI) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/reply_comment`,
        comment,
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
export const editComment = createAsyncThunk(
  "comment/editComment",
  async (
    comment: { _id?: string; blog_id?: string; content: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API}/edit_comment/${comment._id}`,
        comment,
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
export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async ({ _id, blog_id }: { _id?: string; blog_id?: string }, thunkAPI) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/delete_comment/${_id}/${blog_id}`,
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
export const likeAndUnLikeComment = createAsyncThunk(
  "comment/likeAndUnLikeComment",
  async (
    comment: { _id?: string; blog_id?: string; type: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/like_and_unlike_comment`,
        comment,
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

export interface CommentState {
  loading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  comments: IComment[] | null;
  count: number;
}

const initialState: CommentState = {
  loading: false,
  isSuccess: false,
  isError: false,
  message: "",
  comments: null,
  count: 0,
};

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    resetComments: (state) => {
      return {
        ...state,
        loading: false,
        isSuccess: false,
        isError: false,
        message: "",
        comments: null,
        count: 0,
      };
    },
    setComments: (state: CommentState, action) => {
      return {
        ...state,
        loading: false,
        isSuccess: true,
        isError: false,
        message: "",
        comments: action.payload.comments,
        count: action.payload.count,
      };
    },
  },

  extraReducers: (builder: any) => {
    builder.addCase(createComment.pending, (state: CommentState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      createComment.fulfilled,
      (state: CommentState, action: any) => {
        return {
          ...state,
          loading: false,
          isSuccess: true,
          comments: action.payload.comments,
          count: action.payload.count,
        };
      }
    );
    builder.addCase(
      createComment.rejected,
      (state: CommentState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload,
        };
      }
    );
    builder.addCase(fetchComments.pending, (state: CommentState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      fetchComments.fulfilled,
      (state: CommentState, action: any) => {
        return {
          ...state,
          loading: false,
          isSuccess: true,
          comments: action.payload.comments,
          count: action.payload.count,
        };
      }
    );
    builder.addCase(
      fetchComments.rejected,
      (state: CommentState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload,
        };
      }
    );
    builder.addCase(replyComment.pending, (state: CommentState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      replyComment.fulfilled,
      (state: CommentState, action: any) => {
        return {
          ...state,
          loading: false,
          isSuccess: true,
          comments: action.payload.comments,
          count: action.payload.count,
        };
      }
    );
    builder.addCase(
      replyComment.rejected,
      (state: CommentState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload,
        };
      }
    );
    builder.addCase(editComment.pending, (state: CommentState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      editComment.fulfilled,
      (state: CommentState, action: any) => {
        return {
          ...state,
          loading: false,
          isSuccess: true,
          comments: action.payload.comments,
          count: action.payload.count,
        };
      }
    );
    builder.addCase(
      editComment.rejected,
      (state: CommentState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload,
        };
      }
    );
    builder.addCase(deleteComment.pending, (state: CommentState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      deleteComment.fulfilled,
      (state: CommentState, action: any) => {
        return {
          ...state,
          loading: false,
          isSuccess: true,
          comments: action.payload.comments,
          count: action.payload.count,
        };
      }
    );
    builder.addCase(
      deleteComment.rejected,
      (state: CommentState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload,
        };
      }
    );
    builder.addCase(likeAndUnLikeComment.pending, (state: CommentState) => {
      return { ...state, loading: true };
    });
    builder.addCase(
      likeAndUnLikeComment.fulfilled,
      (state: CommentState, action: any) => {
        return {
          ...state,
          loading: false,
          isSuccess: true,
          comments: action.payload.comments,
          count: action.payload.count,
        };
      }
    );
    builder.addCase(
      likeAndUnLikeComment.rejected,
      (state: CommentState, action: PayloadAction) => {
        toast.error(`${action.payload}`);
        return {
          ...state,
          loading: false,
          isSuccess: true,
          message: action.payload,
        };
      }
    );
  },
});

// Action creators are generated for each case reducer function
export const { resetComments, setComments } = commentSlice.actions;

export default commentSlice.reducer;
