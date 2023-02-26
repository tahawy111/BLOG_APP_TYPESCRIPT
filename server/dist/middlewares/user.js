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
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(req.headers);
    try {
        const token = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        if (!token)
            return res.status(404).json({ msg: "Token Not Found" });
        const decoded = (jsonwebtoken_1.default.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`));
        if (!decoded)
            return res.status(404).json({ msg: "Invalid Authentication" });
        const user = yield User_1.default.findById(decoded.id);
        if (!user)
            return res.status(404).json({ msg: "User Not Found In autherization" });
        req.user = user;
        next();
    }
    catch (error) {
        res.status(500).json({ msg: error.message });
    }
});
exports.auth = auth;
