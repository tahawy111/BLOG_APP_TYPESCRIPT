import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IDecodedToken, IReqAuth } from "../config/interface";
import User from "../models/User";

export const auth = async (
  req: IReqAuth,
  res: Response,
  next: NextFunction
) => {
  console.log(req.headers);
  try {
    const token = req.headers?.authorization;
    if (!token) return res.status(404).json({ msg: "Token Not Found" });
    const decoded = <IDecodedToken>(
      jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
    );
    if (!decoded)
      return res.status(404).json({ msg: "Invalid Authentication" });

    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ msg: "User Not Found In autherization" });
    req.user = user;
    next();
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};
