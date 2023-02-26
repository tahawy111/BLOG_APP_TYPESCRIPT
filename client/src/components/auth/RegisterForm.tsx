import React, { useState } from "react";
import { IFormEvent, InputChange } from "../../utils/TypeScript";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { register } from "../../slices/authSlice";
import { startLoading, stopLoading } from "../../slices/globalSlice";

export interface IUserRegister {
  name: string;
  account: string;
  password: string;
  cf_password: string;
}
const RegisterForm = () => {
  const [registerForm, setRegisterForm] = useState({
    name: "",
    account: "",
    password: "",
    cf_password: "",
  });
  const { name, account, password, cf_password } = registerForm;
  const dispatch: AppDispatch = useDispatch();
  const [typePass, setTypePass] = useState(false);

  const handleChangeInput = (e: InputChange) => {
    const { value, name } = e.target;
    setRegisterForm({ ...registerForm, [name]: value });
  };
  const submitHandler = async (e: IFormEvent) => {
    e.preventDefault();
    dispatch(startLoading());
    await dispatch(register(registerForm));
    dispatch(stopLoading());
  };
  return (
    <form onSubmit={submitHandler}>
      <div className="form-group mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="Your name is up tp 20 chars"
          id="name"
          name="name"
          value={name}
          onChange={handleChangeInput}
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="account" className="form-label">
          Email
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="example@email.com"
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
            placeholder="Password must be at least 6 chars"
            id="password"
            name="password"
            value={password}
            onChange={handleChangeInput}
          />
        </div>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="cf_password" className="form-label">
          Confirm Password
        </label>

        <div className="pass">
          <input
            type={typePass ? "text" : "password"}
            className="form-control"
            placeholder="Your confirm password."
            id="cf_password"
            name="cf_password"
            value={cf_password}
            onChange={handleChangeInput}
          />

          <small onClick={() => setTypePass(!typePass)}>
            {typePass ? "Hide" : "Show"}
          </small>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-dark w-100 my-2"
        disabled={account && password ? false : true}
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
