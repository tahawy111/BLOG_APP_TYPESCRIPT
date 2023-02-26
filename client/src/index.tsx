import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";
import "react-alert-confirm/lib/style.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Provider store={store}>
        <GoogleOAuthProvider
          clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
        >
          <App />
          <ToastContainer position="bottom-center" autoClose={5000} limit={3} />
        </GoogleOAuthProvider>
      </Provider>
    </BrowserRouter>
  </HelmetProvider>
);
