import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { startLoading, stopLoading } from "../../slices/globalSlice";
import { AppDispatch } from "../../store";
import { IFormEvent } from "../../utils/TypeScript";

const ResetPassword = () => {
  const token = useParams().token;
  const dispatch: AppDispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [cf_password, setCfPassword] = useState("");
  const [typePass, setTypePass] = useState(false);
  const [typeCfPass, setTypeCfPass] = useState(false);

  const handleSubmit = async (e: IFormEvent) => {
    e.preventDefault();
    if (!password && !cf_password)
      return toast.warning("Please fill in all fields");
    if (password !== cf_password)
      return toast.warning("Passwords dosn't matches!!");
    try {
      dispatch(startLoading());
      const res = await axios.post(
        `${process.env.REACT_APP_API}/auth_reset_password`,
        {
          password,
          cf_password,
          token,
        }
      );

      dispatch(stopLoading());
      toast.success(res.data.msg);
    } catch (error: any) {
      toast.error(error.response.data.msg);
      dispatch(stopLoading());
    }
  };

  return (
    <Layout>
      <div className="auth_page">
        <form className="auth_box" onSubmit={handleSubmit}>
          <h3 className="text-uppercase text-center mb-4">Reset Password</h3>

          <div className="form-group my-2">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="pass">
              <input
                type={typePass ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <small onClick={() => setTypePass(!typePass)}>
                {typePass ? "Hide" : "Show"}
              </small>
            </div>
          </div>

          <div className="form-group my-2">
            <label htmlFor="password" className="form-label">
              Confirm Password
            </label>
            <div className="pass">
              <input
                type={typeCfPass ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                value={cf_password}
                onChange={(e) => setCfPassword(e.target.value)}
              />
              <small onClick={() => setTypeCfPass(!typeCfPass)}>
                {typeCfPass ? "Hide" : "Show"}
              </small>
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100 mt-2">
            Reset
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ResetPassword;
