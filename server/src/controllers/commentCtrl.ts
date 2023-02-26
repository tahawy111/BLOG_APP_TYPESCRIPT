import { Request, Response } from "express";
import Comment from "../models/Comment";
import { IReqAuth } from "./../config/interface";
import mongoose, { Aggregate } from "mongoose";
import { Pagination } from "./blogCtrl";
import { io } from "../server";

const getCommentAggr = (id: string): any => [
  {
    $facet: {
      totalData: [
        {
          $match: {
            blog_id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "users",
            localField: "reply_user",
            foreignField: "_id",
            as: "reply_user",
          },
        },
        {
          $unwind: {
            path: "$reply_user",
            preserveNullAndEmptyArrays: true,
          },
        },

        { $sort: { createdAt: -1 } },
      ],
      totalCount: [
        {
          $match: {
            blog_id: new mongoose.Types.ObjectId(id),
          },
        },
        { $count: "count" },
      ],
    },
  },
  {
    $project: {
      count: { $arrayElemAt: ["$totalCount.count", 0] },
      totalData: 1,
    },
  },
];

const commentCtrl = {
  async createComment(req: IReqAuth, res: Response) {
    try {
      if (!req.user)
        return res.status(400).json({ msg: "Invalid Authentication." });

      const { content, blog_id, blog_user_id } = req.body;
      const { limit, skip } = Pagination(req);

      const newComment = new Comment({
        content,
        blog_id,
        blog_user_id,
        user: req?.user._id,
        replyCM: [],
        comment_root: null,
        reply_user: null,
      });

      await newComment.save();

      const data = await Comment.aggregate(getCommentAggr(blog_id));

      const comments = data[0].totalData;
      const count = data[0].totalCount;

      io.to(`${blog_id}`).emit("changeComment", { comments, count });

      return res.json({ comments, count });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  async getComments(req: Request, res: Response) {
    const { limit, skip } = Pagination(req);

    try {
      const data = await Comment.aggregate(getCommentAggr(req.params.id));

      const comments = data[0].totalData;
      const count = data[0].totalCount;

      // io.to(`${req.params.id}`).emit("changeComment", { comments, count });

      return res.json({ comments, count });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  async replyComment(req: IReqAuth, res: Response) {
    if (!req.user)
      return res.status(400).json({ msg: "invalid Authentication." });

    try {
      const { content, blog_id, blog_user_id, comment_root, reply_user } =
        req.body;

      const { limit, skip } = Pagination(req);

      const newComment = new Comment({
        user: req.user._id,
        content,
        blog_id,
        blog_user_id,
        comment_root,
        reply_user: reply_user._id,
      });

      await newComment.save();

      await Comment.findByIdAndUpdate(comment_root, {
        $push: { replyCM: newComment._id },
      });

      const data = await Comment.aggregate(getCommentAggr(blog_id));

      const comments = data[0].totalData;
      const count = data[0].totalCount;

      io.to(`${blog_id}`).emit("changeComment", { comments, count });
      return res.json({ comments, count });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  async editComment(req: IReqAuth, res: Response) {
    if (!req.user)
      return res.status(400).json({ msg: "invalid Authentication." });

    try {
      const { content, blog_id } = req.body;

      const { limit, skip } = Pagination(req);
      await Comment.findByIdAndUpdate(req.params.id, {
        content,
      });

      const data = await Comment.aggregate(getCommentAggr(blog_id));

      const comments = data[0].totalData;
      const count = data[0].totalCount;

      io.to(`${blog_id}`).emit("changeComment", { comments, count });

      return res.json({ comments, count });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  async deleteComment(req: IReqAuth, res: Response) {
    if (!req.user)
      return res.status(400).json({ msg: "invalid Authentication." });

    try {
      const { id, blog_id } = req.params;

      const { limit, skip } = Pagination(req);
      const deletedComment = await Comment.findByIdAndRemove(id);
      if (!deletedComment) return;
      for (let i = 0; i < deletedComment.replyCM.length; i++) {
        const id = deletedComment?.replyCM[i];
        await Comment.findByIdAndRemove(id);
      }

      const data = await Comment.aggregate(getCommentAggr(blog_id));

      const comments = data[0].totalData;
      const count = data[0].totalCount;

      io.to(`${blog_id}`).emit("changeComment", { comments, count });

      return res.json({ comments, count });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  async likeAndUnLikeComment(req: IReqAuth, res: Response) {
    if (!req.user)
      return res.status(400).json({ msg: "invalid Authentication." });

    try {
      const { _id, blog_id, type } = req.body;
      const comment: any = await Comment.findById(_id);

      if (type === "like") {
        await Comment.findByIdAndUpdate(_id, {
          $push: { likes: req.user._id },
        });
      } else {
        const filtured = comment?.likes.filter(
          (id?: any) => JSON.stringify(id) !== JSON.stringify(req.user?._id)
        );
        await Comment.findByIdAndUpdate(_id, { $set: { likes: filtured } });
      }

      const data = await Comment.aggregate(getCommentAggr(blog_id));

      const comments = data[0].totalData;
      const count = data[0].totalCount;

      io.to(`${blog_id}`).emit("changeComment", { comments, count });

      return res.json({ comments, count });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default commentCtrl;
