import Layout from "../../components/Layout";
import { RootState } from "../../store";
import "./profile.css";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import UserInfo from "../../components/profile/UserInfo";
import UserBlogs from "../../components/blogs/UserBlogs";
import { useParams } from "react-router-dom";
import OtherInfo from "../../components/profile/OtherInfo";
import { Helmet } from "react-helmet-async";

const Profile = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const slug: any = useParams();
  return (
    <Layout>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <Row className="my-3">
        <Col md={5} className="mb-3">
          {auth?.user?.user !== null && auth?.user?.user?._id !== slug?.id ? (
            <OtherInfo id={slug?.id} />
          ) : (
            <UserInfo />
          )}
        </Col>
        <Col md={7} className="mb-3">
          <UserBlogs id={slug?.id} />
        </Col>
      </Row>
    </Layout>
  );
};

export default Profile;
