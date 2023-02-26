import { Router } from "express";
import authCtrl from "../controllers/authCtrl";

import userCtrl from "../controllers/userCtrl";
import { validRegister } from "../middlewares/valid";

const router = Router();

router.post("/register", validRegister, authCtrl.register);
router.post("/active", authCtrl.activeAccount);
router.post("/login", authCtrl.login);
router.get("/logout", authCtrl.logout);
router.get("/refresh_token", authCtrl.refreshToken);
router.post("/google_login", authCtrl.googleLogin);
router.post("/facebook_login", authCtrl.facebookLogin);
router.post("/forgot_password", authCtrl.forgotPassword);
router.post("/auth_reset_password", authCtrl.authResetPassword);

// Tests
router.post("/test", userCtrl.test);

export default router;
