import { Router } from "express";
import { auth } from "../middlewares/user";
import categoryCtrl from "./../controllers/categoryCtrl";

const router = Router();

router
  .route("/category/:id")
  .put(auth, categoryCtrl.updateCategory)
  .delete(auth, categoryCtrl.deleteCategory);

router
  .route("/category")
  .post(auth, categoryCtrl.createCategory)
  .get(categoryCtrl.getCategory);

export default router;
