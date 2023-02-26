import { useEffect, useState, useRef } from "react";
import { IBlogs, IComment, ICreateBlogProps } from "../../utils/TypeScript";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { Link, useNavigate } from "react-router-dom";
import { startLoading, stopLoading } from "../../slices/globalSlice";
import { createComment, fetchComments } from "../../slices/commentSlice";
import { CommentList } from "../comments/CommentList";
import { CommentForm } from "../comments/CommentForm";
import { FaEdit, FaTrash } from "react-icons/fa";
import CreateForm from "./CreateForm";
import CardHoriz from "../cards/CardHoriz";
import Quill from "../editor/Quill";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import AlertConfirm from "react-alert-confirm";
import { getBlogs, reset } from "../../slices/blogSlice";
import axios from "axios";

interface Props {
  blog: IBlogs;
}

const DisplayBlog: React.FC<Props> = ({ blog: blogData }) => {
  const [blog, setBlog] = useState(blogData);
  const [rootComments, setRootComments] = useState<IComment[] | undefined>([]);
  const auth = useSelector((state: RootState) => state.auth);
  const comment = useSelector((state: RootState) => state.comment);
  const [isEditing, setIsEditing] = useState(false);
  const [body, setBody] = useState<string>(blog.content);
  const dispatch: AppDispatch = useDispatch();
  const divRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleComment = (body: string) => {
    const data: IComment = {
      content: body,
      blog_id: blog?._id,
      blog_user_id: blog?.user?._id,
      createdAt: new Date().toISOString(),
    };
    dispatch(startLoading());
    dispatch(createComment(data));
    dispatch(stopLoading());
  };
  const [editBlog, setEditBlog] = useState<ICreateBlogProps>(blog);

  const handleEditSubmit = async () => {
    try {
      dispatch(startLoading());
      const res = await axios.get(
        `${process.env.REACT_APP_API}/blogId/${editBlog?._id}`,
        {
          headers: {
            authorization: JSON.parse(localStorage.user).access_token,
          },
        }
      );
      setBlog(res.data.blog);
      setEditBlog(res.data.blog);
      dispatch(stopLoading());
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response.data.msg);
      dispatch(stopLoading());
    }
  };
  const handleDelete = async () => {
    try {
      const [isOk] = await AlertConfirm("Are you sure to delete this blog?");
      if (!isOk) return;
      dispatch(startLoading());
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/blogId/${blog?._id}`,
        {
          headers: {
            authorization: JSON.parse(localStorage.user).access_token,
          },
        }
      );
      toast.success(res.data.msg);
      navigate("/");
      dispatch(stopLoading());
      dispatch(reset());
      dispatch(getBlogs());
    } catch (error: any) {
      toast.error(error.response.data.msg);
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    dispatch(fetchComments(blog._id));
  }, [blog._id, dispatch]);

  useEffect(() => {
    const comms = comment.comments?.filter(
      (cm: IComment) => cm.comment_root === null
    );
    setRootComments(comms);
  }, [comment.comments]);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;
    const content = body;
    setEditBlog({ ...blog, content });
  }, [body, blog]);

  return (
    <div>
      {/* Toggler */}
      {auth.user?.user._id === blog.user._id && (
        <div className="w-100 d-flex justify-content-end my-3 pe-3 align-items-center">
          <label htmlFor="editicon" className="fs-3 fw-bold mx-3">
            EDIT:
          </label>{" "}
          <FaEdit
            id="editicon"
            onClick={() => setIsEditing(!isEditing)}
            size={25}
            className="text-warning mb-2"
          />
          <label htmlFor="editicon" className="fs-3 fw-bold mx-3">
            DELETE:
          </label>{" "}
          <FaTrash
            id="editicon"
            onClick={handleDelete}
            size={25}
            className="text-danger mb-2"
          />
        </div>
      )}

      {isEditing ? (
        <>
          <div className="my-4 create_blog">
            <h1>Edit Blog ({blog.title})</h1>

            <div className="row mt-4">
              <div className="col-md-6">
                <h5>Create</h5>
                <CreateForm blog={editBlog} setBlog={setEditBlog} />
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
              onClick={handleEditSubmit}
              className="mt-3 d-block mx-auto fs-6"
            >
              Edit Blog
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Blog Details Sectiion */}
          <h2
            className="text-center my-3 text-capitalize fs-1"
            style={{ color: "#ff7a00" }}
          >
            {blog.title}
          </h2>
          <div className="text-end fst-italic" style={{ color: "teal" }}>
            <small>
              {typeof blog.user !== "string" && (
                <Link to={`/profile/${blog.user._id}`}>
                  By: {blog.user.name}
                </Link>
              )}
            </small>

            <small className="ms-2">
              {new Date(blog.createdAt).toLocaleString()}
            </small>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          />
        </>
      )}

      {/* Comment Section */}
      <hr />
      <h2 className="my-1 orange text-center">⭐ Comments ⭐</h2>

      {auth.user !== null ? (
        <CommentForm type="comment" error onSubmit={handleComment} />
      ) : (
        <h4>
          Please{" "}
          <Link
            to={`/login?blog/${blog._id}`}
            className="orange text-decoration-underline"
          >
            Login
          </Link>{" "}
          To Comment
        </h4>
      )}

      {/* Show Comments */}
      <div className="my-3">
        {comment.comments &&
          `${Intl.NumberFormat(undefined, { notation: "compact" }).format(
            comment.comments?.length
          )}`}
        {comment.comments && comment.comments?.length > 1
          ? " Comments"
          : " Comment"}
      </div>
      {rootComments !== undefined && (
        <div className="mt-4">
          <CommentList comments={rootComments} />
        </div>
      )}
    </div>
  );
};

export default DisplayBlog;
