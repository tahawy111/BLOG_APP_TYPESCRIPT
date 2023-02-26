import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import blogSlice from "./slices/blogSlice";
import categorySlice from "./slices/categorySlice";
import globalSlice from "./slices/globalSlice";
import commentSlice from "./slices/commentSlice";
import socketSlice from "./slices/socketSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    global: globalSlice,
    category: categorySlice,
    blog: blogSlice,
    comment: commentSlice,
    socket: socketSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
