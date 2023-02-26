import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useParams } from "react-router-dom";
import { IBlogs } from "../../utils/TypeScript";
import DisplayBlog from "../../components/blogs/DisplayBlog";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { toast } from "react-toastify";
import axios from "axios";

const Blog = () => {
  const { id }: any = useParams();
  const [detailBlog, setDetailBlog] = useState<IBlogs>();
  const { socket } = useSelector((state: RootState) => state.socket);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/blogId/${id}`
        );
        setDetailBlog(res.data);
      } catch (error: any) {
        toast.error(error.response.data.msg);
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    if (!id) return;
    socket && socket.emit("joinRoom", id);

    return () => {
      socket && socket.emit("outRoom", id);
    };
  }, [id, socket]);

  return (
    <Layout>
      <Helmet>
        <title>{detailBlog?.title}</title>
      </Helmet>
      {detailBlog && <DisplayBlog blog={detailBlog} />}
    </Layout>
  );
};

export default Blog;
