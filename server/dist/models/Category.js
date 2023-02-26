"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please Add Your Category name"],
        trim: true,
        maxLength: [50, "Your Category name is up to 50 chars long."],
        unique: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("categorie", categorySchema);
