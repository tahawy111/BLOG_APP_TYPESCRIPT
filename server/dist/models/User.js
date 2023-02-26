"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please Add your name"],
        trim: true,
        maxLength: [20, "Your name is up to 20 chars long."],
    },
    account: {
        type: String,
        required: [true, "Please Add your email or phone"],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please add your password"],
        trim: true,
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
    },
    role: {
        type: String,
        default: "user", // login
    },
    type: {
        type: String,
        default: "register", // fast
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("user", userSchema);
