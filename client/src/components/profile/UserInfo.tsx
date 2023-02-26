import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../../store";
import { InputChange, IFormEvent } from "../../utils/TypeScript";
import ModalInstance from "../Layout/Modal";
import AlertConfirm from "react-alert-confirm";
import { checkImage, imageUpload } from "../../utils/imageUpload";
import { resetPassword, update } from "../../slices/authSlice";
import { startLoading, stopLoading } from "../../slices/globalSlice";

const UserInfo = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user.user;
  const [formData, setFormData] = useState({
    name: user?.name,
    account: user?.account,
    avatar: user?.avatar,
  });
  const [changePasswordData, setChangePasswordData] = useState({
    oldPassword: "",
    password: "",
    password2: "",
  });

  const handleChangePassword = (e: InputChange) => {
    const { value, name } = e.target;
    setChangePasswordData({ ...changePasswordData, [name]: value });
  };

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const handleChangePasswordModalClose = () =>
    setShowChangePasswordModal(false);
  const handleChangePasswordModalShow = () => setShowChangePasswordModal(true);

  const handleChangeInput = (e: InputChange) => {
    if (e.target.type === "file") {
      const target = e.target as HTMLInputElement;
      target?.files &&
        setFormData({
          ...formData,
          [target.name]: {
            preview: URL.createObjectURL(target?.files[0]),
            file: target?.files[0],
          },
        });
    } else {
      const { value, name } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const [typePass2, setTypePass2] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    // console.log();
  });

  const handleChangePasswordSubmit = async (e: IFormEvent) => {
    if (changePasswordData.password !== changePasswordData.password2)
      toast.warning("Passwords do not matches");

    dispatch(startLoading());
    dispatch(resetPassword(changePasswordData));
    dispatch(stopLoading());

    setShowChangePasswordModal(false);
  };

  const handleChangeInfoSubmit = async (e: IFormEvent) => {
    e.preventDefault();
    if (formData.avatar || formData.name || formData.account) {
      const [isOk] = await AlertConfirm(
        "Are you sure to change your personal info?"
      );
      if (!isOk) return;
      let updateObj: {
        name: string;
        account: string;
        avatar: File;
      } = {
        name: formData.name,
        account: formData.account,
        avatar: formData.avatar.file || formData.avatar,
      };

      dispatch(startLoading());

      if ((updateObj.avatar?.name || updateObj.avatar) !== user.avatar) {
        const check = checkImage(updateObj.avatar);
        if (check !== "") return toast.warning(check);
        const photo = await imageUpload(updateObj.avatar);
        if (photo.url) updateObj.avatar = photo.url;
      }
      dispatch(update(updateObj));
      dispatch(stopLoading());
    }
  };
  function ChangePasswordModal() {
    return (
      <ModalInstance
        title="Change Password"
        closeText="Cancel"
        submitText="Change Password"
        handleClose={handleChangePasswordModalClose}
        handleSubmit={handleChangePasswordSubmit}
        show={showChangePasswordModal}
      >
        <div className="form-group">
          <label htmlFor="oldPassword">Enter Your Old Passowrd</label>
          <input
            type={typePass2 ? "text" : "password"}
            name="oldPassword"
            className="form-control"
            id="oldPassword"
            value={changePasswordData.oldPassword}
            onChange={handleChangePassword}
          />
          <small
            style={{ cursor: "pointer" }}
            onClick={() => setTypePass2(!typePass2)}
          >
            {typePass2 ? "Hide" : "Show"}
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="PasswordChange">Enter New Password</label>
          <input
            type="text"
            name="password"
            className="form-control"
            id="PasswordChange"
            value={changePasswordData.password}
            onChange={handleChangePassword}
          />
        </div>
        <div className="form-group">
          <label htmlFor="PasswordChange2">Confirm New Password</label>
          <input
            type="text"
            name="password2"
            className="form-control"
            id="PasswordChange2"
            value={changePasswordData.password2}
            onChange={handleChangePassword}
          />
        </div>
      </ModalInstance>
    );
  }

  return (
    <form className="profile_info" onSubmit={handleChangeInfoSubmit}>
      <div className="info_avatar">
        <img
          src={
            formData?.avatar?.preview ? formData?.avatar?.preview : user?.avatar
          }
          alt="avatar"
        />

        <span>
          <i className="fas fa-camera"></i>
          <p>Change</p>
          <input
            type="file"
            name="avatar"
            onChange={handleChangeInput}
            accept="image/*"
            id="file_up"
          />
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          id="name"
          value={formData.name}
          onChange={handleChangeInput}
        />
      </div>
      <div className="form-group">
        <label htmlFor="account">Account</label>
        <input
          type="text"
          name="account"
          className="form-control"
          id="account"
          value={formData.account}
          onChange={handleChangeInput}
          disabled={user.type === "login"}
        />

        {user.type === "login" && (
          <small style={{ cursor: "pointer" }} className="text-danger">
            Your Account is linked wit social auth so you can't change it
          </small>
        )}
      </div>
      {/* <div className="form-group">
        <label htmlFor="checkPassword">Passowrd</label>
        <input
          type={typePass ? "text" : "password"}
          name="password"
          className="form-control"
          id="checkPassword"
          value={formData.password}
          onChange={handleChangeInput}
          disabled={user.type === "login"}
        />
        <small
          style={{ cursor: "pointer" }}
          onClick={() => setTypePass(!typePass)}
        >
          {typePass ? "Hide" : "Show"}
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="cfPassword">Confirm Password</label>
        <input
          type={typePass ? "text" : "password"}
          className="form-control"
          id="cfPassword"
          name="cfPassword"
          value={formData.cfPassword}
          onChange={handleChangeInput}
          disabled={user.type === "login"}
        />
        <small
          style={{ cursor: "pointer" }}
          onClick={() => setTypePass(!typePass)}
        >
          {typePass ? "Hide" : "Show"}
        </small>
      </div> */}
      <small
        style={{ cursor: "pointer" }}
        onClick={handleChangePasswordModalShow}
        className="text-danger"
      >
        Change Password
      </small>
      <button className="btn btn-dark w-100" type="submit">
        Update
      </button>
      {ChangePasswordModal()}
    </form>
  );
};

export default UserInfo;
