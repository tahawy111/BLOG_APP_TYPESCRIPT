import { Router } from "express";
import { auth } from "../middlewares/user";
import blogCtrl from "./../controllers/blogCtrl";

const router = Router();

router
  .route("/blog")
  .post(auth, blogCtrl.createBlog)
  .get(blogCtrl.getHomeBlogs);
router.route("/blog/:category_id").get(blogCtrl.getBlogsByCategory);
router.route("/blog/user/:id").get(blogCtrl.getBlogsByUser);
router
  .route("/blogId/:id")
  .get(blogCtrl.getBlog)
  .put(auth, blogCtrl.editBlog)
  .delete(auth, blogCtrl.deleteBlog);

router.get("/search/blogs", blogCtrl.searchBlogs);

export default router;
