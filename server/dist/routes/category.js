"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../middlewares/user");
const categoryCtrl_1 = __importDefault(require("./../controllers/categoryCtrl"));
const router = (0, express_1.Router)();
router
    .route("/category/:id")
    .put(user_1.auth, categoryCtrl_1.default.updateCategory)
    .delete(user_1.auth, categoryCtrl_1.default.deleteCategory);
router
    .route("/category")
    .post(user_1.auth, categoryCtrl_1.default.createCategory)
    .get(categoryCtrl_1.default.getCategory);
exports.default = router;
