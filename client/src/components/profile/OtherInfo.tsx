import axios from "axios";
import { useEffect, useState } from "react";
import "../../pages/profile/profile.css";
import { IUserData } from "./../../utils/TypeScript";

interface Props {
  id: string;
}

const OtherInfo: React.FC<Props> = ({ id }) => {
  const [user, setUser] = useState<IUserData | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/user/${id}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);
  if (!user) return <h1>Loading...</h1>;

  return (
    <div className="profile_info text-center rounded">
      <div className="info_avatar">
        <img src={user?.avatar} alt="avatar" />
      </div>

      <h5 className="text-uppercase text-danger">{user?.role}</h5>

      <div>
        Name: <span className="text-info">{user?.name}</span>
      </div>

      <div>Email / Phone number</div>
      <span className="text-info">{user?.account}</span>

      <div>
        Join Date:{" "}
        <span style={{ color: "#ffc107" }}>
          {new Date(user?.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default OtherInfo;
