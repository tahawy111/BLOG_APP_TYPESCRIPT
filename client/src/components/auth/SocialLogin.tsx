import { useDispatch } from "react-redux";
import { googleLogin, facebookLogin } from "../../slices/authSlice";
import { AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";

const SocialLogin = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const onSuccess = (credentialResponse: any) => {
    dispatch(googleLogin(credentialResponse.credential)).then(() => {
      navigate("/");
    });
  };
  const onFBSuccess = (response: any) => {
    const { accessToken, userID } = response;
    dispatch(facebookLogin({ accessToken, userID })).then(() => {
      navigate("/");
    });
  };

  return (
    <div>
      <div className="d-flex align-items-center flex-column">
        <GoogleLogin
          useOneTap
          onSuccess={onSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />

        <FacebookLogin
          style={{
            backgroundColor: "#4267b2",
            color: "#fff",
            fontSize: "16px",
            padding: "7px 44px",
            border: "none",
            borderRadius: "5px",
          }}
          appId={`${process.env.REACT_APP_FACEBOOK_CLIENT_ID}`}
          onSuccess={onFBSuccess}
          onFail={(error) => {
            console.log("Login Failed!", error);
          }}
          onProfileSuccess={(response) => {
            console.log("Get Profile Success!", response);
          }}
        />
      </div>
    </div>
  );
};

export default SocialLogin;
