import { IComment } from "../../utils/TypeScript";
import { Comment } from "./Comment";

export function CommentList({
  comments,
}: {
  comments: IComment[] | undefined | any;
}) {
  if (!comments) return;
  return comments.map((comment: IComment) => {
    return (
      <div key={comment._id} className="comment-stack">
        <Comment {...comment} />
      </div>
    );
  });
}
