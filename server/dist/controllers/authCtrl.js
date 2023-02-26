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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_URL = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("./../config/generateToken");
const sendMail_1 = __importDefault(require("./../config/sendMail"));
const valid_1 = require("./../middlewares/valid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const client = new google_auth_library_1.OAuth2Client(`${process.env.MAIL_CLIEN_ID}`);
exports.CLIENT_URL = `${process.env.BASE_URL}`;
const authCtrl = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, account, password } = req.body;
            const user = yield User_1.default.findOne({ account });
            if (user)
                return res
                    .status(403)
                    .json({ msg: "Email or phone number already exists." });
            const hashedPassword = bcrypt_1.default.hashSync(password, 12);
            const newUser = { name, account, password: hashedPassword };
            const active_token = (0, generateToken_1.generateActiveToken)({ newUser });
            const url = `${exports.CLIENT_URL}/active/${active_token}`;
            const SENDER_MAIL = `${process.env.SENDER_EMAIL_ADDRESS}`;
            const txt = "Verify Your Email Address";
            const mailOptions = {
                from: `"Cool Blog Verify Email" <${SENDER_MAIL}>`,
                to: account,
                subject: "Cool Blog",
                html: `
              <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
              <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Cool Blog Website.</h2>
              <p>Congratulations! You're almost set to start using Cool Blog.
                  Just click the button below to validate your email address.
              </p>
              
              <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: block;width: fit-content;margin-left: auto;margin-right: auto;">${txt}</a>
          
              <p>If the button doesn't work for any reason, you can also click on the link below:</p>
          
              <div>${url}</div>
              </div>
            `,
            };
            if ((0, valid_1.validEmail)(account)) {
                yield (0, sendMail_1.default)(mailOptions);
                //     const savedUser = await newUser.save();
                return res.status(201).json({
                    msg: "Register success. Please Check Your Email",
                    data: newUser,
                    active_token,
                });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Error occured Register" });
        }
    }),
    activeAccount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { active_token } = req.body;
            if (!active_token)
                return res.status(403).json({ msg: "Please add your token!" });
            const decoded = (jsonwebtoken_1.default.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`));
            const { newUser } = decoded;
            if (!newUser)
                return res.status(400).json({ msg: "Invalid authentication" });
            const user = new User_1.default(newUser);
            yield user.save();
            return res.status(201).json({ msg: "Account has been activated!" });
        }
        catch (error) {
            if (error.code === 11000)
                return res.status(403).json({ msg: "Account is already exist!" });
            if (error.name === "TokenExpiredError")
                return res
                    .status(403)
                    .json({ msg: "Token is expired please try again!" });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { account, password } = req.body;
        const user = yield User_1.default.findOne({ account });
        if (!user)
            return res.status(404).json({ msg: "This user does not exists!" });
        // if User exists
        loginUser(user, password, res);
    }),
    logout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
            res.json({ msg: "Logged out" });
        }
        catch (error) {
            res.status(400).json({ error });
        }
    }),
    refreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token)
                return res.status(400).json({ msg: "Please login now!" });
            const decoded = (jsonwebtoken_1.default.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`));
            if (!decoded)
                return res.status(400).json({ msg: "Please login now!" });
            const user = yield User_1.default.findById(decoded.id).select("-password");
            if (!user)
                return res.status(400).json({ msg: "This account does not exists." });
            const access_token = (0, generateToken_1.generateAccessToken)({ id: user._id });
            res.json({ access_token });
        }
        catch (error) {
            return res.status(400).json({ error });
        }
    }),
    googleLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id_token } = req.body;
            const verify = yield client.verifyIdToken({
                idToken: id_token,
                audience: `${process.env.MAIL_CLIEN_ID}`,
            });
            const { email, email_verified, name, picture } = (verify.getPayload());
            if (!email_verified)
                return res.status(500).json({ msg: "Email verification failed" });
            const password = email + process.env.SIGNIN_SECRET;
            const passwordHash = bcrypt_1.default.hashSync(password, 12);
            const user = yield User_1.default.findOne({ account: email });
            if (user) {
                if (user.type === "register")
                    return res
                        .status(500)
                        .json({ msg: "This Email Is Used In A Normal Login" });
                loginUser(user, password, res);
            }
            else {
                const user = {
                    name,
                    account: email,
                    password: passwordHash,
                    avatar: picture,
                    type: "login",
                };
                registerUser(user, res);
            }
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    facebookLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { accessToken, userID } = req.body;
            const URL = `https://graph.facebook.com/v3.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;
            const { data } = yield axios_1.default.get(URL);
            const { id, name, email, picture } = data;
            const password = email + process.env.SIGNIN_SECRET;
            const passwordHash = bcrypt_1.default.hashSync(password, 12);
            const user = yield User_1.default.findOne({ account: email });
            if (user) {
                if (user.type === "register")
                    return res
                        .status(500)
                        .json({ msg: "This Email Is Used In A Normal Login" });
                loginUser(user, password, res);
            }
            else {
                const user = {
                    name,
                    account: email,
                    password: passwordHash,
                    avatar: picture.data.url,
                    type: "login",
                };
                registerUser(user, res);
            }
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    forgotPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { account } = req.body;
            const txt = "Change Your Password on Cool Blog";
            const user = yield User_1.default.findOne({ account });
            if (!user)
                return res.status(400).json({ msg: "This account does not exist." });
            if (user.type !== "register")
                return res.status(400).json({
                    msg: `Quick login account with ${user.type} can't use this function.`,
                });
            const access_token = (0, generateToken_1.generateActiveToken)({ id: user._id });
            const url = `${exports.CLIENT_URL}/reset_password/${access_token}`;
            const mailOptions = {
                from: '"Cool Blog Verify Email" <amer.vib582@gmail.com>',
                to: account,
                subject: "Cool Blog",
                html: `
              <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
              <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Cool Blog Website.</h2>
              <p>Congratulations! You're almost set to start using Cool Blog.
                  Just click the button below to Change Your Password.
              </p>
              
              <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: block;width: fit-content;margin-left: auto;margin-right: auto;">${txt}</a>
          
              <p>If the button doesn't work for any reason, you can also click on the link below:</p>
          
              <div>${url}</div>
              </div>
            `,
            };
            if ((0, valid_1.validEmail)(account)) {
                yield (0, sendMail_1.default)(mailOptions);
                return res.json({ msg: "Success! Please check your email." });
            }
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    authResetPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { password, token, cf_password } = req.body;
            if (password !== cf_password)
                return res.status(403).json({ msg: "Passwords dosn't matches!!" });
            const decoded = jsonwebtoken_1.default.verify(token, `${process.env.ACTIVE_TOKEN_SECRET}`);
            if (!decoded)
                return res
                    .status(400)
                    .json({ msg: "JWT Expired Please Send New Mail And Try Again" });
            const user = yield User_1.default.findById(decoded.id);
            if (!user)
                return;
            if (bcrypt_1.default.compareSync(password, user.password))
                return res
                    .status(403)
                    .json({ msg: "You Can't Reset Your Password To The Old One" });
            const passwordHash = bcrypt_1.default.hashSync(password, 12);
            yield User_1.default.findOneAndUpdate({ _id: decoded.id }, {
                password: passwordHash,
            });
            res.json({ msg: "Reset Password Success!" });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
};
const loginUser = (user, passwordC, res) => {
    const isMatch = bcrypt_1.default.compareSync(passwordC, user.password);
    if (!isMatch)
        return res.status(403).json({ msg: "password is incorrect" });
    const access_token = (0, generateToken_1.generateAccessToken)({ id: user._id });
    const { password } = user, userR = __rest(user, ["password"]);
    res.json({ msg: "Login success!", access_token, user: userR._doc });
};
const registerUser = (user, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new User_1.default(user);
    yield newUser.save();
    newUser.password = "";
    const access_token = (0, generateToken_1.generateAccessToken)({ id: newUser._id });
    res.json({ msg: "Login success!", access_token, user: newUser._doc });
});
exports.default = authCtrl;
