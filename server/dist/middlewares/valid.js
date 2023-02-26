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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validEmail = exports.validPhone = exports.validRegister = void 0;
const validRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, account, password } = req.body;
    if (!name || !account || !password)
        return res.status(400).json({ msg: "Please fill inputs!" });
    const errors = [];
    if (!name)
        errors.push("Please add your name!");
    if (name.length > 20) {
        errors.push("Your name is up to 20 chars long.");
    }
    if (!account)
        errors.push("Please add your email or phone number!");
    if (!validPhone(account) && !validEmail(account)) {
        errors.push("Email or phone number format is incorrect.");
    }
    if (!password) {
        errors.push("Please add your password!");
    }
    if (password.length < 6) {
        errors.push("Password must be at least 6 chars.");
    }
    if (errors.length > 0)
        return res.status(400).json({ msg: errors });
    next();
});
exports.validRegister = validRegister;
function validPhone(phone) {
    const re = /^[+]/g;
    return re.test(phone);
}
exports.validPhone = validPhone;
function validEmail(email) {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
}
exports.validEmail = validEmail;
