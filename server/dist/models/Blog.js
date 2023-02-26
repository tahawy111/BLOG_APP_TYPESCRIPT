"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blogSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Types.ObjectId, ref: "user" },
    title: {
        type: String,
        required: [true, "Please Add Your Blog name"],
        trim: true,
        minLength: [10, "Your Blog title must be at least 10 chars long."],
        maxLength: [50, "Your Blog title must be at most 50 chars long."],
    },
    description: {
        type: String,
        require: true,
        trim: true,
        minLength: 50,
        maxLength: 200,
    },
    content: {
        type: String,
        required: [true, "Please Add Your Blog name"],
        trim: true,
        minLength: [2000, "Your Blog content must be at least 2000 chars long."],
    },
    thumbnail: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "categorie",
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("blog", blogSchema);
