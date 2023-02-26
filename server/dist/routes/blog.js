"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../middlewares/user");
const blogCtrl_1 = __importDefault(require("./../controllers/blogCtrl"));
const router = (0, express_1.Router)();
router
    .route("/blog")
    .post(user_1.auth, blogCtrl_1.default.createBlog)
    .get(blogCtrl_1.default.getHomeBlogs);
router.route("/blog/:category_id").get(blogCtrl_1.default.getBlogsByCategory);
router.route("/blog/user/:id").get(blogCtrl_1.default.getBlogsByUser);
router
    .route("/blogId/:id")
    .get(blogCtrl_1.default.getBlog)
    .put(user_1.auth, blogCtrl_1.default.editBlog)
    .delete(user_1.auth, blogCtrl_1.default.deleteBlog);
router.get("/search/blogs", blogCtrl_1.default.searchBlogs);
exports.default = router;
