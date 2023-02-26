import { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import { ICreateBlogProps } from "../../utils/TypeScript";
import CardHoriz from "../../components/cards/CardHoriz";
import CreateForm from "../../components/blogs/CreateForm";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {} from "../../slices/categorySlice";
import { startLoading, stopLoading } from "../../slices/globalSlice";
import { Button } from "react-bootstrap";
import { validCreateBlog } from "./../../utils/valid";
import { toast } from "react-toastify";
import { imageUpload } from "../../utils/imageUpload";
import { createBlog } from "./../../slices/blogSlice";
import Quill from "./../../components/editor/Quill";
import { Helmet } from "react-helmet-async";

const CreateBlog = () => {
  const initialState = {
    user: "",
    title: "",
    content: "",
    description: "",
    thumbnail: "",
    category: "",
    createdAt: new Date().toISOString(),
  };
  const dispatch = useDispatch<AppDispatch>();

  const divRef = useRef<HTMLDivElement>(null);
  const [blog, setBlog] = useState<ICreateBlogProps>(initialState);
  const [body, setBody] = useState<string>("");

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;
    const content = div?.innerText as string;
    setBlog({ ...blog, content });
  }, [body, blog]);

  const handleSubmit = async () => {
    // const div = divRef.current;
    // const content = div?.innerText as string;
    // setBlog({ ...blog, content });
    let url = "";
    const check = validCreateBlog({ ...blog });
    if (check !== "") return toast.error(check);

    if (typeof blog.thumbnail?.preview) {
      const photo = await imageUpload(blog.thumbnail?.file);
      url = photo.url;
    } else {
      url = blog.thumbnail;
    }

    let newBlog = {
      ...blog,
      thumbnail: url,
      content: body,
    };

    // Dispatch
    dispatch(startLoading());
    dispatch(createBlog(newBlog)).then(() => {
      dispatch(stopLoading());
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>Create Blog</title>
      </Helmet>
      <div className="my-4 create_blog">
        <h1>Create Blog</h1>

        <div className="row mt-4">
          <div className="col-md-6">
            <h5>Create</h5>
            <CreateForm blog={blog} setBlog={setBlog} />
          </div>
          <div className="col-md-6">
            <h5>Preview</h5>
            <CardHoriz blog={blog} />
          </div>
        </div>
        <Quill body={body} setBody={setBody} />

        <div
          className="mt-3"
          ref={divRef}
          dangerouslySetInnerHTML={{
            __html: body,
          }}
        />
        <small>{blog.content.length}</small>

        <Button
          variant="dark"
          onClick={handleSubmit}
          className="mt-3 d-block mx-auto"
        >
          Add Post
        </Button>
      </div>
    </Layout>
  );
};

export default CreateBlog;
