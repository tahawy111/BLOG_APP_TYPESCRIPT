import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogsByUserId } from "../../slices/authSlice";
import { AppDispatch, RootState } from "../../store";
import { IBlogs } from "../../utils/TypeScript";
import CardHoriz from "../cards/CardHoriz";
import { useNavigate } from "react-router-dom";
import getQuery from "../../utils/getQuery";

interface Props {
  id: string;
}

const UserBlogs: React.FC<Props> = ({ id }) => {
  const navigate = useNavigate();
  const qSearch: any = getQuery(window.location.search);
  const userBlogs = useSelector((state: RootState) => state.auth.userBlogs);
  const dispatch: AppDispatch = useDispatch();
  const [page, setPage] = useState<number>(+qSearch.page || 1);
  useEffect(() => {
    navigate(`/profile/${id}?page=${page}`);
    dispatch(getBlogsByUserId({ userId: id, page }));
  }, [id, dispatch, page, navigate]);
  return (
    <div>
      <div>
        {userBlogs?.blogs &&
          userBlogs.blogs.map((blog: IBlogs) => (
            <CardHoriz key={blog._id} blog={blog} />
          ))}
      </div>

      <div>
        <Pagination
          defaultPage={page}
          count={userBlogs?.total}
          variant="outlined"
          shape="rounded"
          color="primary"
          style={{ margin: "20px 0" }}
          onChange={(_, value) => setPage(value)}
          showFirstButton
          showLastButton
        />
      </div>
    </div>
  );
};

export default UserBlogs;
