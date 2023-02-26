"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../models/Category"));
const categoryCtrl = {
    createCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user)
                return res.status(500).json({ msg: "Invalid Authentication." });
            if (req.user.role !== "admin")
                return res.status(500).json({ msg: "You Are Not An Admin." });
            const name = req.body.name.toLowerCase();
            const category = yield Category_1.default.findOne({ name });
            // if (category)
            //   res.status(403).json({ msg: "This Category Is Already Exists! 😕" });
            const newCat = new Category_1.default({ name });
            yield newCat.save();
            const categories = yield Category_1.default.find().sort("-createdAt");
            res.status(201).json({ msg: "Category Created ✔", categories });
        }
        catch (error) {
            let errMsg;
            if (error.code === 11000) {
                errMsg = "This Category Is Already Exists! 😕";
                return res.status(500).json({ msg: errMsg });
            }
            return res.status(500).json({ msg: error.message });
        }
    }),
    getCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categories = yield Category_1.default.find().sort("-createdAt");
            res.json({ categories });
        }
        catch (error) {
            return res.status(400).json({ msg: error.message });
        }
    }),
    updateCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user)
                return res.status(500).json({ msg: "Invalid Authentication." });
            if (req.user.role !== "admin")
                return res.status(500).json({ msg: "You Are Not An Admin." });
            const name = req.body.name.toLowerCase();
            yield Category_1.default.findByIdAndUpdate(req.params.id, {
                name,
            });
            const categories = yield Category_1.default.find().sort("-createdAt");
            res.json({ msg: "Update Success ✔", categories });
        }
        catch (error) {
            let errMsg;
            if (error.code === 11000) {
                errMsg = "This Category Is Already Exists! 😕";
                return res.status(500).json({ msg: errMsg });
            }
            return res.status(500).json({ msg: error.message });
        }
    }),
    deleteCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Category_1.default.findByIdAndDelete(req.params.id);
            const categories = yield Category_1.default.find().sort("-createdAt");
            res.json({ msg: "Delete Success! 🗑", categories });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
};
exports.default = categoryCtrl;
