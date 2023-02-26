"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentCtrl_1 = __importDefault(require("../controllers/commentCtrl"));
const user_1 = require("../middlewares/user");
const router = (0, express_1.Router)();
// create comment
router.post("/comment", user_1.auth, commentCtrl_1.default.createComment);
// get Comments
router.get("/comments/blog/:id", commentCtrl_1.default.getComments);
// Reply Comment
router.post("/reply_comment", user_1.auth, commentCtrl_1.default.replyComment);
// Delete Comment
router.put("/edit_comment/:id", user_1.auth, commentCtrl_1.default.editComment);
// Delete Comment
router.delete("/delete_comment/:id/:blog_id", user_1.auth, commentCtrl_1.default.deleteComment);
// Like And Un Like Comment
router.post("/like_and_unlike_comment", user_1.auth, commentCtrl_1.default.likeAndUnLikeComment);
exports.default = router;
