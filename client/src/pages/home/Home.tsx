import Layout from "../../components/Layout";
import "./home.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { Link } from "react-router-dom";
import { IBlogs } from "../../utils/TypeScript";
import CardVert from "../../components/cards/CardVert";
import { useEffect } from "react";
import { resetComments } from "../../slices/commentSlice";
import { Helmet } from "react-helmet-async";
const Home = () => {
  const { blogs } = useSelector((state: RootState) => state.blog);
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(resetComments());
  }, [blogs, dispatch]);

  return (
    <Layout>
      <Helmet>
        <title>Cool Blog</title>
      </Helmet>
      <div className="home_page">
        {blogs?.map((homeBlog) => (
          <div key={homeBlog._id}>
            {homeBlog.count > 0 && (
              <>
                <h3>
                  <Link to={`/blogs/${homeBlog.name.toLowerCase()}`}>
                    {homeBlog.name} <small>({homeBlog.count})</small>
                  </Link>
                </h3>
                <hr className="mt-1" />

                <div className="home_blogs">
                  {homeBlog.blogs.map((blog: IBlogs) => (
                    <CardVert key={blog?._id} blog={blog} />
                  ))}
                </div>
              </>
            )}

            {homeBlog.count > 4 && (
              <Link
                className="text-end d-block mt-2 mb-3"
                to={`/blogs/${homeBlog.name}`}
              >
                Read more &gt;&gt;
              </Link>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
