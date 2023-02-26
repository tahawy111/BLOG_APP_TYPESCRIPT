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
const Test_1 = __importDefault(require("../models/Test"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const valid_1 = require("../middlewares/valid");
const sendMail_1 = __importDefault(require("../config/sendMail"));
const authCtrl_1 = require("./authCtrl");
const generateToken_1 = require("../config/generateToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userCtrl = {
    updateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        if (!req.user)
            return res.status(400).json({ msg: "Invalid Authentication" });
        // Check Inputs
        try {
            req.body.name === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.name) && delete req.body.name;
            req.body.avatar === ((_b = req.user) === null || _b === void 0 ? void 0 : _b.avatar) && delete req.body.avatar;
            req.body.account === ((_c = req.user) === null || _c === void 0 ? void 0 : _c.account) && delete req.body.account;
            // if (bcrypt.compareSync(req.body.oldPassword, req.user?.password))
            //   return res.status(403).json({ msg: "Old Password is Wrong" });
            // if (bcrypt.compareSync(req.body.password, req.user?.password)) {
            //   delete req.body.password;
            // } else {
            //   req.body.password = bcrypt.hashSync(req.body.password, 12);
            // }
            if (req.body.account !== ((_d = req.user) === null || _d === void 0 ? void 0 : _d.account) &&
                req.body.account !== undefined) {
                const active_token = (0, generateToken_1.generateActiveToken)({
                    id: (_e = req.user) === null || _e === void 0 ? void 0 : _e.id,
                    user: req.body,
                });
                const url = `${authCtrl_1.CLIENT_URL}/changeEmail/${active_token}`;
                const SENDER_MAIL = `${process.env.SENDER_EMAIL_ADDRESS}`;
                const txt = "Confirm Your Email Address";
                const mailOptions = {
                    from: `"Change Email" <${SENDER_MAIL}>`,
                    to: req.body.account,
                    subject: "Change Email Verification",
                    html: `
          <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
                <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Tahawy channel.</h2>
                <p>Congratulations! You're almost set to start Change Email on BlogDEV.
                Just click the button below to Change your email address.
                </p>
                
                <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: block;width: fit-content;margin-left: auto;margin-right: auto;">${txt}</a>
            
                <p>If the button doesn't work for any reason, you can also click on the link below:</p>
            
                <p>${url}</p>
                </div>
              `,
                };
                if ((0, valid_1.validEmail)(req.body.account)) {
                    yield (0, sendMail_1.default)(mailOptions);
                    //     const savedUser = await newUser.save();
                    return res.status(201).json({
                        msg: "Sent Verification Email. The Race is on! 5 minutes to confirm your new email",
                        data: req.body,
                        active_token,
                    });
                }
                else {
                    return res.status(400).json({ msg: "Invalid Email" });
                }
            }
            try {
                const user = yield User_1.default.findByIdAndUpdate((_f = req.user) === null || _f === void 0 ? void 0 : _f._id, req.body, {
                    new: true,
                }).select("-password");
                res.json({ msg: "User Updated Successfully", user });
            }
            catch (error) {
                return res.status(400).json({ msg: error.message });
            }
        }
        catch (error) {
            return res.status(400).json({ msg: error.message });
        }
    }),
    confirmUpdateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { active_token } = req.body;
            if (!active_token)
                return res.status(403).json({ msg: "Please add your token!" });
            const decoded = (jsonwebtoken_1.default.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`));
            const user = yield User_1.default.findByIdAndUpdate(decoded.id, decoded.user, {
                new: true,
            }).select("-password");
            return res.status(200).json({ msg: "User Changed Successfully!", user });
        }
        catch (error) {
            if (error.code === 11000)
                return res.status(403).json({ msg: "Account is already exist!" });
            if (error.name === "TokenExpiredError")
                return res
                    .status(403)
                    .json({ msg: "Token is expired please try again!" });
            return res.status(400).json({ msg: error });
        }
    }),
    resetPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _g, _h, _j;
        if (!req.user)
            return res.status(400).json({ msg: "Invalid Authentication" });
        if (!bcrypt_1.default.compareSync(req.body.oldPassword, (_g = req.user) === null || _g === void 0 ? void 0 : _g.password))
            return res.status(403).json({ msg: "Old Password is Wrong" });
        if (bcrypt_1.default.compareSync(req.body.password, (_h = req.user) === null || _h === void 0 ? void 0 : _h.password)) {
            return res
                .status(403)
                .json({ msg: "You can't change to the old password" });
        }
        else {
            req.body.password = bcrypt_1.default.hashSync(req.body.password, 12);
        }
        try {
            const user = yield User_1.default.findByIdAndUpdate((_j = req.user) === null || _j === void 0 ? void 0 : _j._id, { password: req.body.password }, {
                new: true,
            }).select("-password");
            res.json({ msg: "Reset Password Successfully", user });
        }
        catch (error) {
            return res.status(400).json({ msg: error.message });
        }
    }),
    getUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _k;
        try {
            const user = yield User_1.default.findById((_k = req.params) === null || _k === void 0 ? void 0 : _k.id).select("-password");
            res.json({ user });
        }
        catch (error) {
            return res.status(400).json({ msg: error.message });
        }
    }),
    // Test
    test: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            /* Add Person */
            // const newPerson = new Test({
            //   name: "Samir",
            //   isActive: false,
            //   age: 47,
            //   gender: "male",
            //   eyeColor: "green",
            //   favoriteFruit: "banana",
            //   company: {},
            //   tags: ["Hello", "Do", "You"],
            // });
            // const person = await newPerson.save();
            // res.send(person);
            const findAggregate = yield Test_1.default.aggregate([
                // {
                //   $group: { _id: { favoriteFruit: "$favoriteFruit", gender: "$gender" } },
                // },
                {
                    $count: "Hello",
                },
            ]);
            res.send(findAggregate);
        }
        catch (error) {
            res.status(400).json({ error });
        }
    }),
};
exports.default = userCtrl;
