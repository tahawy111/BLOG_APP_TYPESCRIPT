import { useState } from "react";

export function CommentForm({
  loading,
  error,
  onSubmit,
  autoFocus = false,
  initialValue = "",
  type = "comment",
}: any) {
  const [message, setMessage] = useState(initialValue);

  function handleSubmit(e: any) {
    e.preventDefault();
    onSubmit(message);
    setMessage("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="comment-form-row">
        <textarea
          autoFocus={autoFocus}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
        />
        <button className="btn fw-bold" type="submit" disabled={loading}>
          {loading
            ? "Loading"
            : type === "comment"
            ? "Comment"
            : type === "reply"
            ? "Reply"
            : "Edit"}
        </button>
      </div>
      <div className="error-msg">{error}</div>
    </form>
  );
}
