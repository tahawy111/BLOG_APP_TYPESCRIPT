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
const Comment_1 = __importDefault(require("../models/Comment"));
const mongoose_1 = __importDefault(require("mongoose"));
const blogCtrl_1 = require("./blogCtrl");
const server_1 = require("../server");
const getCommentAggr = (id) => [
    {
        $facet: {
            totalData: [
                {
                    $match: {
                        blog_id: new mongoose_1.default.Types.ObjectId(id),
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
                        blog_id: new mongoose_1.default.Types.ObjectId(id),
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
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user)
                    return res.status(400).json({ msg: "Invalid Authentication." });
                const { content, blog_id, blog_user_id } = req.body;
                const { limit, skip } = (0, blogCtrl_1.Pagination)(req);
                const newComment = new Comment_1.default({
                    content,
                    blog_id,
                    blog_user_id,
                    user: req === null || req === void 0 ? void 0 : req.user._id,
                    replyCM: [],
                    comment_root: null,
                    reply_user: null,
                });
                yield newComment.save();
                const data = yield Comment_1.default.aggregate(getCommentAggr(blog_id));
                const comments = data[0].totalData;
                const count = data[0].totalCount;
                server_1.io.to(`${blog_id}`).emit("changeComment", { comments, count });
                return res.json({ comments, count });
            }
            catch (error) {
                return res.status(500).json({ msg: error.message });
            }
        });
    },
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = (0, blogCtrl_1.Pagination)(req);
            try {
                const data = yield Comment_1.default.aggregate(getCommentAggr(req.params.id));
                const comments = data[0].totalData;
                const count = data[0].totalCount;
                // io.to(`${req.params.id}`).emit("changeComment", { comments, count });
                return res.json({ comments, count });
            }
            catch (error) {
                return res.status(500).json({ msg: error.message });
            }
        });
    },
    replyComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return res.status(400).json({ msg: "invalid Authentication." });
            try {
                const { content, blog_id, blog_user_id, comment_root, reply_user } = req.body;
                const { limit, skip } = (0, blogCtrl_1.Pagination)(req);
                const newComment = new Comment_1.default({
                    user: req.user._id,
                    content,
                    blog_id,
                    blog_user_id,
                    comment_root,
                    reply_user: reply_user._id,
                });
                yield newComment.save();
                yield Comment_1.default.findByIdAndUpdate(comment_root, {
                    $push: { replyCM: newComment._id },
                });
                const data = yield Comment_1.default.aggregate(getCommentAggr(blog_id));
                const comments = data[0].totalData;
                const count = data[0].totalCount;
                server_1.io.to(`${blog_id}`).emit("changeComment", { comments, count });
                return res.json({ comments, count });
            }
            catch (err) {
                return res.status(500).json({ msg: err.message });
            }
        });
    },
    editComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return res.status(400).json({ msg: "invalid Authentication." });
            try {
                const { content, blog_id } = req.body;
                const { limit, skip } = (0, blogCtrl_1.Pagination)(req);
                yield Comment_1.default.findByIdAndUpdate(req.params.id, {
                    content,
                });
                const data = yield Comment_1.default.aggregate(getCommentAggr(blog_id));
                const comments = data[0].totalData;
                const count = data[0].totalCount;
                server_1.io.to(`${blog_id}`).emit("changeComment", { comments, count });
                return res.json({ comments, count });
            }
            catch (err) {
                return res.status(500).json({ msg: err.message });
            }
        });
    },
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return res.status(400).json({ msg: "invalid Authentication." });
            try {
                const { id, blog_id } = req.params;
                const { limit, skip } = (0, blogCtrl_1.Pagination)(req);
                const deletedComment = yield Comment_1.default.findByIdAndRemove(id);
                if (!deletedComment)
                    return;
                for (let i = 0; i < deletedComment.replyCM.length; i++) {
                    const id = deletedComment === null || deletedComment === void 0 ? void 0 : deletedComment.replyCM[i];
                    yield Comment_1.default.findByIdAndRemove(id);
                }
                const data = yield Comment_1.default.aggregate(getCommentAggr(blog_id));
                const comments = data[0].totalData;
                const count = data[0].totalCount;
                server_1.io.to(`${blog_id}`).emit("changeComment", { comments, count });
                return res.json({ comments, count });
            }
            catch (err) {
                return res.status(500).json({ msg: err.message });
            }
        });
    },
    likeAndUnLikeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user)
                return res.status(400).json({ msg: "invalid Authentication." });
            try {
                const { _id, blog_id, type } = req.body;
                const comment = yield Comment_1.default.findById(_id);
                if (type === "like") {
                    yield Comment_1.default.findByIdAndUpdate(_id, {
                        $push: { likes: req.user._id },
                    });
                }
                else {
                    const filtured = comment === null || comment === void 0 ? void 0 : comment.likes.filter((id) => { var _a; return JSON.stringify(id) !== JSON.stringify((_a = req.user) === null || _a === void 0 ? void 0 : _a._id); });
                    yield Comment_1.default.findByIdAndUpdate(_id, { $set: { likes: filtured } });
                }
                const data = yield Comment_1.default.aggregate(getCommentAggr(blog_id));
                const comments = data[0].totalData;
                const count = data[0].totalCount;
                server_1.io.to(`${blog_id}`).emit("changeComment", { comments, count });
                return res.json({ comments, count });
            }
            catch (err) {
                return res.status(500).json({ msg: err.message });
            }
        });
    },
};
exports.default = commentCtrl;
