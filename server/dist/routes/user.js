"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userCtrl_1 = __importDefault(require("../controllers/userCtrl"));
const user_1 = require("../middlewares/user");
// import { validRegister } from "../middlewares/valid";
const router = (0, express_1.Router)();
router.patch("/user", user_1.auth, userCtrl_1.default.updateUser);
router.post("/confirmChangeEmail", userCtrl_1.default.confirmUpdateUser);
router.post("/resetPassword", user_1.auth, userCtrl_1.default.resetPassword);
router.get("/user/:id", userCtrl_1.default.getUser);
exports.default = router;
