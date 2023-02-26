import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import NotFound from "./pages/NotFound";
import Home from "./pages/home/Home";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
// import { gapi } from "gapi-script";
import Profile from "./pages/profile/Profile";
import Active from "./pages/active/Active";
import ChangeEmail from "./pages/active/ChangeEmail";
import { useJwt } from "react-jwt";
import { logout } from "./slices/authSlice";
import { useEffect } from "react";
import Category from "./pages/category/Category";
import CreateBlog from "./pages/createBlog/CreateBlog";
import { getCategory } from "./slices/categorySlice";
import { getBlogs } from "./slices/blogSlice";
import BlogsByCategory from "./pages/blogs/BlogsByCategory";
import Blog from "./pages/blog/Blog";
import { socket as socketIo } from "./slices/socketSlice";
import { io } from "socket.io-client";
import SocketClient from "./utils/SocketClient";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";
function App() {
  const dispatch: AppDispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  // const state = useSelector((state: RootState) => state);
  // gapi.load("client:auth2", () => {
  //   gapi.client.init({
  //     clientId: `${process.env.REACT_APP_GOOGLE_CLIENT_ID}`,
  //     plugin_name: "blogDev",
  //   });
  // });
  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_BASE_URL_API}`);
    dispatch(socketIo(socket));
    return () => {
      socket.close();
    };
  }, [dispatch]);

  // useEffect(() => {
  //   const socket = io(`${process.env.REACT_APP_BASE_URL_API}`);
  //   socket.on("connect", () => {
  //     console.log("socket connected");
  //     console.log(socket);
  //   });
  //   dispatch(socketIo(socket));
  // }, [dispatch]);

  const { isExpired } = useJwt(auth.user?.access_token);

  useEffect(() => {
    if (isExpired && localStorage.user) {
      dispatch(logout());
    }
  }, [isExpired, dispatch]);
  useEffect(() => {
    dispatch(getBlogs());
    dispatch(getCategory());
  }, [dispatch]);

  return (
    <>
      <SocketClient />
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          {/* Start Auth Routes */}
          <Route
            path="login"
            element={auth.user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="register"
            element={auth.user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="active/:token"
            element={auth.user ? <Navigate to="/" /> : <Active />}
          />
          {/* End Auth Routes */}
          <Route path="profile/:id" element={<Profile />} />
          <Route
            path="changeEmail/:token"
            element={auth.user ? <ChangeEmail /> : <Navigate to="/login" />}
          />
          {/* Category */}
          <Route
            path="category"
            element={auth.user ? <Category /> : <Navigate to="/login" />}
          />
          {/* Blogs */}
          <Route
            path="create_blog"
            element={auth.user ? <CreateBlog /> : <Navigate to="/login" />}
          />
          <Route path="blogs/:category" element={<BlogsByCategory />} />
          <Route path="blog/:id" element={<Blog />} />
          {/* ForgotPassword */}
          <Route path="forgot_password" element={<ForgotPassword />} />
          {/* ResetPassword */}
          <Route path="reset_password/:token" element={<ResetPassword />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
