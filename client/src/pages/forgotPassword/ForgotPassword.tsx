import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "../../components/Layout";
import { IFormEvent } from "../../utils/TypeScript";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { startLoading, stopLoading } from "../../slices/globalSlice";
import axios from "axios";

const ForgotPassword = () => {
  const [account, setAccount] = useState("");
  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = async (e: IFormEvent) => {
    e.preventDefault();
    dispatch(startLoading());
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/forgot_password`,
        { account }
      );
      toast.success(res.data.msg);
      dispatch(stopLoading());
    } catch (error: any) {
      toast.success(error.response.data.msg);
      dispatch(stopLoading());
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "500px" }}
      >
        <div className="my-4" style={{ maxWidth: "500px" }}>
          <h2>Forgot Password?</h2>

          <form className="form-group" onSubmit={handleSubmit}>
            <label htmlFor="account">Email</label>

            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control"
                id="account"
                name="account"
                onChange={(e) => setAccount(e.target.value)}
              />

              <button
                className="btn btn-primary mx-2 d-flex align-items-center"
                type="submit"
              >
                <i className="fas fa-paper-plane me-2" /> Send
              </button>
            </div>
            <h6 className="mt-3 text-danger">
              After Click Send, Check Your Email
            </h6>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
