import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { activeAccount } from "../../slices/authSlice";
import { AppDispatch } from "../../store";

const Active = () => {
  const dispatch: AppDispatch = useDispatch();
  const { token } = useParams();
  const [activated, setActivated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      if (activated === true) return;
      dispatch(activeAccount(token)).then(() => setActivated(true));
    }
  }, [token, dispatch, activated]);
  return (
    <Layout>
      <Helmet>
        <title>Active Account</title>
      </Helmet>
      <div
        style={{ height: "calc(100vh - 300px)" }}
        className="d-flex justify-content-center flex-column align-items-center"
      >
        <h1 className="text-center">Active Account</h1>
        <br />
        {activated === true ? (
          <>
            <h2 className="text-center text-success">
              Congratulations,
              <br /> Your account has been activated
            </h2>
            <br />
            <button
              onClick={() => navigate("/login")}
              className="btn btn-success btn-lg "
            >
              Go To Signin Screen And Siginin
            </button>
          </>
        ) : (
          <div>Hello</div>
        )}
      </div>
    </Layout>
  );
};

export default Active;
