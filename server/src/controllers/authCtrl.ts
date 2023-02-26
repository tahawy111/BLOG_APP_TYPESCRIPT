import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateActiveToken,
} from "./../config/generateToken";
import sendMail from "./../config/sendMail";
import { validEmail } from "./../middlewares/valid";
import jwt from "jsonwebtoken";
import {
  IGgPayload,
  IReqAuth,
  IToken,
  IUser,
  IUserParams,
} from "./../config/interface";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

const client = new OAuth2Client(`${process.env.MAIL_CLIEN_ID}`);
export const CLIENT_URL = `${process.env.BASE_URL}`;

const authCtrl = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, account, password } = req.body;
      const user = await User.findOne({ account });
      if (user)
        return res
          .status(403)
          .json({ msg: "Email or phone number already exists." });
      const hashedPassword = bcrypt.hashSync(password, 12);
      const newUser = { name, account, password: hashedPassword };
      const active_token = generateActiveToken({ newUser });
      const url = `${CLIENT_URL}/active/${active_token}`;
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

      if (validEmail(account)) {
        await sendMail(mailOptions);
        //     const savedUser = await newUser.save();
        return res.status(201).json({
          msg: "Register success. Please Check Your Email",
          data: newUser,
          active_token,
        });
      }
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ msg: "Error occured Register" });
    }
  },
  activeAccount: async (req: Request, res: Response) => {
    try {
      const { active_token } = req.body;
      if (!active_token)
        return res.status(403).json({ msg: "Please add your token!" });
      const decoded = <IToken>(
        jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
      );
      const { newUser } = decoded;
      if (!newUser)
        return res.status(400).json({ msg: "Invalid authentication" });

      const user = new User(newUser);
      await user.save();

      return res.status(201).json({ msg: "Account has been activated!" });
    } catch (error: any) {
      if (error.code === 11000)
        return res.status(403).json({ msg: "Account is already exist!" });
      if (error.name === "TokenExpiredError")
        return res
          .status(403)
          .json({ msg: "Token is expired please try again!" });
    }
  },
  login: async (req: Request, res: Response) => {
    const { account, password } = req.body;
    const user: IUser | null = await User.findOne({ account });
    if (!user)
      return res.status(404).json({ msg: "This user does not exists!" });

    // if User exists
    loginUser(user, password, res);
  },
  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      res.json({ msg: "Logged out" });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now!" });
      const decoded = <IToken>(
        jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
      );
      if (!decoded) return res.status(400).json({ msg: "Please login now!" });

      const user = await User.findById(decoded.id).select("-password");
      if (!user)
        return res.status(400).json({ msg: "This account does not exists." });

      const access_token = generateAccessToken({ id: user._id });

      res.json({ access_token });
    } catch (error) {
      return res.status(400).json({ error });
    }
  },
  googleLogin: async (req: Request, res: Response) => {
    try {
      const { id_token } = req.body;
      const verify = await client.verifyIdToken({
        idToken: id_token,
        audience: `${process.env.MAIL_CLIEN_ID}`,
      });
      const { email, email_verified, name, picture } = <IGgPayload>(
        verify.getPayload()
      );
      if (!email_verified)
        return res.status(500).json({ msg: "Email verification failed" });
      const password = email + process.env.SIGNIN_SECRET;
      const passwordHash = bcrypt.hashSync(password, 12);
      const user: IUser | null = await User.findOne({ account: email });
      if (user) {
        if (user.type === "register")
          return res
            .status(500)
            .json({ msg: "This Email Is Used In A Normal Login" });
        loginUser(user, password, res);
      } else {
        const user: IUserParams = {
          name,
          account: email,
          password: passwordHash,
          avatar: picture,
          type: "login",
        };
        registerUser(user, res);
      }
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },

  facebookLogin: async (req: Request, res: Response) => {
    try {
      const { accessToken, userID } = req.body;
      const URL = `https://graph.facebook.com/v3.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;
      const { data } = await axios.get(URL);
      const { id, name, email, picture } = data;

      const password = email + process.env.SIGNIN_SECRET;
      const passwordHash = bcrypt.hashSync(password, 12);
      const user: IUser | null = await User.findOne({ account: email });
      if (user) {
        if (user.type === "register")
          return res
            .status(500)
            .json({ msg: "This Email Is Used In A Normal Login" });
        loginUser(user, password, res);
      } else {
        const user: IUserParams = {
          name,
          account: email,
          password: passwordHash,
          avatar: picture.data.url,
          type: "login",
        };
        registerUser(user, res);
      }
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { account } = req.body;
      const txt = "Change Your Password on Cool Blog";
      const user = await User.findOne({ account });
      if (!user)
        return res.status(400).json({ msg: "This account does not exist." });

      if (user.type !== "register")
        return res.status(400).json({
          msg: `Quick login account with ${user.type} can't use this function.`,
        });

      const access_token = generateActiveToken({ id: user._id });

      const url = `${CLIENT_URL}/reset_password/${access_token}`;

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

      if (validEmail(account)) {
        await sendMail(mailOptions);

        return res.json({ msg: "Success! Please check your email." });
      }
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  authResetPassword: async (req: Request, res: Response) => {
    try {
      const { password, token, cf_password } = req.body;
      if (password !== cf_password)
        return res.status(403).json({ msg: "Passwords dosn't matches!!" });
      const decoded: any = jwt.verify(
        token,
        `${process.env.ACTIVE_TOKEN_SECRET}`
      );
      if (!decoded)
        return res
          .status(400)
          .json({ msg: "JWT Expired Please Send New Mail And Try Again" });
      const user = await User.findById(decoded.id);
      if (!user) return;
      if (bcrypt.compareSync(password, user.password))
        return res
          .status(403)
          .json({ msg: "You Can't Reset Your Password To The Old One" });
      const passwordHash = bcrypt.hashSync(password, 12);

      await User.findOneAndUpdate(
        { _id: decoded.id },
        {
          password: passwordHash,
        }
      );

      res.json({ msg: "Reset Password Success!" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const loginUser = (user: IUser, passwordC: string, res: Response) => {
  const isMatch: boolean = bcrypt.compareSync(passwordC, user.password);

  if (!isMatch) return res.status(403).json({ msg: "password is incorrect" });
  const access_token = generateAccessToken({ id: user._id });

  const { password, ...userR } = user;

  res.json({ msg: "Login success!", access_token, user: userR._doc });
};

const registerUser = async (user: IUserParams, res: Response) => {
  const newUser: any = new User(user);
  await newUser.save();
  newUser.password = "";
  const access_token = generateAccessToken({ id: newUser._id });

  res.json({ msg: "Login success!", access_token, user: newUser._doc });
};

export default authCtrl;
