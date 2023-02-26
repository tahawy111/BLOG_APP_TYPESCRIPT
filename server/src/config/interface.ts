import { Request } from "express";
import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  account: string;
  password: string;
  avatar: string;
  role: string;
  type: string;
  _doc?: object;
}

export interface INewUser {
  name: string;
  account: string;
  password: string;
}

export interface IToken extends INewUser {
  id?: string;
  newUser?: INewUser;
  user?: IUser;
  iat: number;
  exp: number;
}
export interface IGgPayload {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
}
export type IUserParams = {
  name: string;
  account: string;
  password: string;
  avatar?: string;
  type: string;
};
export interface IDecodedToken {
  id: string;
  iat: number;
  exp: number;
}

export interface IReqAuth extends Request {
  user?: IUser;
}
