import { Request, Response } from "express";
import Test from "../models/Test";
import { IReqAuth, IToken } from "../config/interface";
import bcrypt from "bcrypt";
import User from "../models/User";
import { validEmail } from "../middlewares/valid";
import sendMail from "../config/sendMail";
import { CLIENT_URL } from "./authCtrl";
import { generateActiveToken } from "../config/generateToken";
import jwt from "jsonwebtoken";

const userCtrl = {
  updateUser: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication" });
    // Check Inputs
    try {
      req.body.name === req.user?.name && delete req.body.name;
      req.body.avatar === req.user?.avatar && delete req.body.avatar;
      req.body.account === req.user?.account && delete req.body.account;

      // if (bcrypt.compareSync(req.body.oldPassword, req.user?.password))
      //   return res.status(403).json({ msg: "Old Password is Wrong" });
      // if (bcrypt.compareSync(req.body.password, req.user?.password)) {
      //   delete req.body.password;
      // } else {
      //   req.body.password = bcrypt.hashSync(req.body.password, 12);
      // }

      if (
        req.body.account !== req.user?.account &&
        req.body.account !== undefined
      ) {
        const active_token = generateActiveToken({
          id: req.user?.id,
          user: req.body,
        });
        const url = `${CLIENT_URL}/changeEmail/${active_token}`;
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

        if (validEmail(req.body.account)) {
          await sendMail(mailOptions);
          //     const savedUser = await newUser.save();
          return res.status(201).json({
            msg: "Sent Verification Email. The Race is on! 5 minutes to confirm your new email",
            data: req.body,
            active_token,
          });
        } else {
          return res.status(400).json({ msg: "Invalid Email" });
        }
      }

      try {
        const user = await User.findByIdAndUpdate(req.user?._id, req.body, {
          new: true,
        }).select("-password");

        res.json({ msg: "User Updated Successfully", user });
      } catch (error: any) {
        return res.status(400).json({ msg: error.message });
      }
    } catch (error: any) {
      return res.status(400).json({ msg: error.message });
    }
  },
  confirmUpdateUser: async (req: Request, res: Response) => {
    try {
      const { active_token } = req.body;
      if (!active_token)
        return res.status(403).json({ msg: "Please add your token!" });
      const decoded = <IToken>(
        jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
      );

      const user = await User.findByIdAndUpdate(decoded.id, decoded.user, {
        new: true,
      }).select("-password");

      return res.status(200).json({ msg: "User Changed Successfully!", user });
    } catch (error: any) {
      if (error.code === 11000)
        return res.status(403).json({ msg: "Account is already exist!" });
      if (error.name === "TokenExpiredError")
        return res
          .status(403)
          .json({ msg: "Token is expired please try again!" });
      return res.status(400).json({ msg: error });
    }
  },
  resetPassword: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication" });

    if (!bcrypt.compareSync(req.body.oldPassword, req.user?.password))
      return res.status(403).json({ msg: "Old Password is Wrong" });

    if (bcrypt.compareSync(req.body.password, req.user?.password)) {
      return res
        .status(403)
        .json({ msg: "You can't change to the old password" });
    } else {
      req.body.password = bcrypt.hashSync(req.body.password, 12);
    }

    try {
      const user = await User.findByIdAndUpdate(
        req.user?._id,
        { password: req.body.password },
        {
          new: true,
        }
      ).select("-password");

      res.json({ msg: "Reset Password Successfully", user });
    } catch (error: any) {
      return res.status(400).json({ msg: error.message });
    }
  },
  getUser: async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params?.id).select("-password");

      res.json({ user });
    } catch (error: any) {
      return res.status(400).json({ msg: error.message });
    }
  },
  // Test
  test: async (req: Request, res: Response) => {
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
      const findAggregate = await Test.aggregate([
        // {
        //   $group: { _id: { favoriteFruit: "$favoriteFruit", gender: "$gender" } },
        // },
        {
          $count: "Hello",
        },
      ]);
      res.send(findAggregate);
    } catch (error) {
      res.status(400).json({ error });
    }
  },
};

export default userCtrl;
