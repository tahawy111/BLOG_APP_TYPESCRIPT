import { Router } from "express";
import commentCtrl from "../controllers/commentCtrl";
import { auth } from "../middlewares/user";

const router = Router();
// create comment
router.post("/comment", auth, commentCtrl.createComment);
// get Comments
router.get("/comments/blog/:id", commentCtrl.getComments);
// Reply Comment
router.post("/reply_comment", auth, commentCtrl.replyComment);
// Delete Comment
router.put("/edit_comment/:id", auth, commentCtrl.editComment);
// Delete Comment
router.delete("/delete_comment/:id/:blog_id", auth, commentCtrl.deleteComment);
// Like And Un Like Comment
router.post("/like_and_unlike_comment", auth, commentCtrl.likeAndUnLikeComment);

export default router;
