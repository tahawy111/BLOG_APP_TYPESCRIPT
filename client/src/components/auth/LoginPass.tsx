import React, { useState } from "react";
import { IFormEvent, InputChange } from "../../utils/TypeScript";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { login } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { startLoading, stopLoading } from "../../slices/globalSlice";

export interface IUserLogin {
  account: string;
  password?: string;
}
const LoginPass = () => {
  const navigate = useNavigate();
  const [userLogin, setUserLogin] = useState({ account: "", password: "" });
  const { account, password } = userLogin;
  const dispatch = useDispatch<AppDispatch>();
  const [typePass, setTypePass] = useState(false);

  const handleChangeInput = (e: InputChange) => {
    const { value, name } = e.target;
    setUserLogin({ ...userLogin, [name]: value });
  };
  let url = window.location.search.replace("?", "/");
  const submitHandler = (e: IFormEvent) => {
    e.preventDefault();
    dispatch(startLoading());
    dispatch(login(userLogin)).then(() => {
      dispatch(stopLoading());

      navigate(`${url && url}`);
    });
  };
  return (
    <form onSubmit={submitHandler}>
      <div className="form-group mb-3">
        <label htmlFor="account" className="form-label">
          Email
        </label>

        <input
          type="text"
          className="form-control"
          id="account"
          name="account"
          value={account}
          onChange={handleChangeInput}
        />
      </div>

      <div className="form-group mb-3">
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
            onChange={handleChangeInput}
          />

          <small onClick={() => setTypePass(!typePass)}>
            {typePass ? "Hide" : "Show"}
          </small>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-dark w-100 mt-1"
        disabled={account && password ? false : true}
      >
        Login
      </button>
    </form>
  );
};

export default LoginPass;
