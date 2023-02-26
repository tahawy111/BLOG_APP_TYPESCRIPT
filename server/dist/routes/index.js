"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const category_1 = __importDefault(require("./category"));
const blog_1 = __importDefault(require("./blog"));
const comment_1 = __importDefault(require("./comment"));
function default_1(app) {
    app.use("/api", auth_1.default);
    app.use("/api", user_1.default);
    app.use("/api", category_1.default);
    app.use("/api", blog_1.default);
    app.use("/api", comment_1.default);
}
exports.default = default_1;
