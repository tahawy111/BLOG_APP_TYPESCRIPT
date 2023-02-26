import { ChangeEvent, FormEvent } from "react";
import { IUser } from "./../../../server/src/config/interface";

export type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
export type IFormEvent = FormEvent<HTMLFormElement>;

export interface IFacebookLoginPayload {
  accessToken: string;
  userID: string;
}

export interface IUserInfo {
  name: string;
  account: string;
  password: string;
  cfPassword: string;
  avatar: string | File;
}

export interface ICategory {
  createdAt?: string;
  name: string;
  updatedAt?: string;
  __v?: number;
  _id: string;
}

export interface ICreateBlogProps {
  _id?: string;
  user: string | IUser | IUserData;
  title: string;
  content: string;
  description: string;
  thumbnail: any;
  category: string;
  createdAt: string;
}
export interface IUserData {
  _id: string;
  name: string;
  account: string;
  avatar: string;
  role: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}
export interface IBlogs {
  _id?: string;
  user: IUserData;
  title: string;
  content: string;
  thumbnail: string | any;
  description: string;
  category: ICategory | any;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}
export interface IBlog {
  _id: string;
  name: string;
  count: number;
  blogs: IBlogs[];
}
export interface IComment {
  _id?: string;
  user?: IUserData;
  blog_id: string | undefined;
  blog_user_id: string | undefined;
  content: string;
  replyCM?: string[];
  reply_user?: IUserData;
  createdAt: string;
  comment_root?: string;
  likes?: string[];
}
