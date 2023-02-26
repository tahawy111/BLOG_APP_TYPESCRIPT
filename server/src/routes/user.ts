import { Router } from "express";
import userCtrl from "../controllers/userCtrl";
import { auth } from "../middlewares/user";
// import { validRegister } from "../middlewares/valid";

const router = Router();

router.patch("/user", auth, userCtrl.updateUser);
router.post("/confirmChangeEmail", userCtrl.confirmUpdateUser);
router.post("/resetPassword", auth, userCtrl.resetPassword);
router.get("/user/:id", userCtrl.getUser);

export default router;
