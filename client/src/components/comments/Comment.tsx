import { IComment } from "../../utils/TypeScript";
import { IconBtn } from "./IconBtn";
import { FaHeart, FaReply, FaEdit, FaTrash, FaRegHeart } from "react-icons/fa";
import { CommentList } from "./CommentList";
import { useEffect, useState } from "react";
import { CommentForm } from "./CommentForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { startLoading, stopLoading } from "../../slices/globalSlice";
import AlertConfirm from "react-alert-confirm";
import { toast } from "react-toastify";
// import { replyComment } from "../../slices/commentSlice";
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function Comment({
  _id,
  content,
  user,
  createdAt,
  blog_id,
  blog_user_id,
  replyCM,
  likes,
}: IComment) {
  const [likedByMe, setLikedByMe] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [areChildrenHidden, setAreChildrenHidden] = useState(true);
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  //   const comment = useSelector((state: RootState) => state.comment);
  const handleReply = async (body: string) => {
    if (!localStorage.user) toast.warning("Please Login To Reply");

    const data = {
      user: auth.user,
      blog_id: blog_id,
      blog_user_id: blog_user_id,
      content: body,
      reply_user: user,
      comment_root: _id,
      createdAt: new Date().toISOString(),
    };
    dispatch(startLoading());
    setAreChildrenHidden(false);
    const { replyComment } = await import("../../slices/commentSlice");
    await dispatch(replyComment(data));
    dispatch(stopLoading());
    setIsReplying(false);
  };
  const handleEdit = async (body: string) => {
    const data = {
      _id,
      blog_id: blog_id,
      content: body,
    };
    dispatch(startLoading());
    const { editComment } = await import("../../slices/commentSlice");
    await dispatch(editComment(data));
    dispatch(stopLoading());
    setIsEditing(false);
  };
  const handleDelete = async (type: string) => {
    const data = {
      _id,
      blog_id,
    };

    const [isOk] = await AlertConfirm(
      `Are you sure to Delete Your Comment ${
        type === "hasReply" ? "And Its Replies" : "?"
      }`
    );
    if (!isOk) return;

    const { deleteComment } = await import("../../slices/commentSlice");
    await dispatch(deleteComment(data));
    setIsEditing(false);
  };
  useEffect(() => {
    likes?.forEach((id: string) => {
      return id === auth.user?.user?._id && setLikedByMe(true);
    });
  }, [auth.user?.user?._id, likes]);
  const handleLike = async () => {
    const data = {
      _id,
      blog_id,
      type: likedByMe ? "unlike" : "like",
    };

    setLikedByMe(!likedByMe);

    const { likeAndUnLikeComment } = await import("../../slices/commentSlice");
    setIsLikeLoading(true);
    await dispatch(likeAndUnLikeComment(data));
    setIsLikeLoading(false);
  };
  const cms = useSelector((state: RootState) => state.comment.comments);

  const childComments = cms?.filter((cm: IComment) => cm.comment_root === _id);

  return (
    <>
      <div className="comment">
        <div className="header">
          <div className="">
            <img
              src={user?.avatar}
              className="rounded-circle"
              alt="avatar"
              width={40}
            />
            <span className="name ms-2">{user?.name}</span>
          </div>
          <div className="date">
            {dateFormatter.format(Date.parse(createdAt))}
          </div>
        </div>
        {isEditing ? (
          <CommentForm
            autoFocus
            initialValue={content}
            onSubmit={handleEdit}
            type="edit"
          />
        ) : (
          <div className="message">{content}</div>
        )}
        <div className="footer">
          <IconBtn
            Icon={likedByMe ? FaHeart : FaRegHeart}
            disabled={isLikeLoading}
            onClick={() =>
              !localStorage.user
                ? toast.warning("Please Login To Like")
                : handleLike()
            }
            aria-label={"Like"}
          >
            {Intl.NumberFormat(undefined, { notation: "compact" }).format(
              likes?.length || 0
            )}
          </IconBtn>
          <IconBtn
            Icon={FaReply}
            aria-label={isReplying ? "Cancel Reply" : "Reply"}
            onClick={() =>
              !localStorage.user
                ? toast.warning("Please Login To Reply")
                : setIsReplying((prev) => !prev)
            }
            isActive={isReplying}
          />
          {localStorage.user &&
            JSON.parse(localStorage.user).user._id === user?._id && (
              <>
                <IconBtn
                  Icon={FaEdit}
                  onClick={() => setIsEditing((prev) => !prev)}
                  isActive={isEditing}
                  aria-label={isEditing ? "Cancel Edit" : "Edit"}
                />

                <IconBtn
                  Icon={FaTrash}
                  onClick={() =>
                    handleDelete(
                      replyCM && replyCM?.length > 0 ? "hasReply" : "hasNoReply"
                    )
                  }
                  aria-label={"Delete"}
                  color={"danger"}
                />
              </>
            )}
        </div>
      </div>

      {isReplying && (
        <>
          <div className="mt-1 ml-3">
            <CommentForm type="reply" autoFocus onSubmit={handleReply} error />
          </div>
        </>
      )}

      {childComments !== undefined && childComments?.length > 0 && (
        <>
          <div
            className={`nested-comments-stack ${
              areChildrenHidden ? "hide" : ""
            }`}
          >
            <button
              className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="nested-comments">
              <CommentList comments={childComments} />
            </div>
          </div>
          <button
            className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show Replies
          </button>
        </>
      )}
    </>
  );
}
