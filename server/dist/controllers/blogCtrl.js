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
exports.Pagination = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Blog_1 = __importDefault(require("../models/Blog"));
const Comment_1 = __importDefault(require("../models/Comment"));
const getAggregate = [
    // User
    {
        $lookup: {
            from: "users",
            let: { user_id: "$user" },
            pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                { $project: { password: 0 } },
            ],
            as: "user", // here you put the name of the input field
        },
    },
    // array -> object
    { $unwind: "$user" },
    // Category
    {
        $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
        },
    },
    // array -> object
    { $unwind: "$category" },
    // Sorting
    { $sort: { createdAt: -1 } },
    // Group by category
    {
        $group: {
            _id: "$category._id",
            name: { $first: "$category.name" },
            blogs: { $push: "$$ROOT" },
            count: { $sum: 1 },
        },
    },
    // Pagination for blogs
    {
        $project: {
            blogs: {
                $slice: ["$blogs", 0, 4],
            },
            count: 1,
            name: 1,
        },
    },
];
const Pagination = (req) => {
    let page = Number(req.query.page) * 1 || 1;
    let limit = Number(req.query.limit) * 1 || 4;
    let skip = (page - 1) * limit;
    return { page, limit, skip };
};
exports.Pagination = Pagination;
const blogCtrl = {
    createBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Invalid Authentication." });
        try {
            const { title, content, description, thumbnail, category } = req.body;
            const newBlog = new Blog_1.default({
                user: req.user._id,
                title,
                content,
                description,
                thumbnail,
                category,
            });
            yield newBlog.save();
            const blogs = yield Blog_1.default.aggregate(getAggregate);
            res.json({ blogs, msg: "Blog Created Successfully ✔" });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    getHomeBlogs: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // // Example 2
        // const blogs = await Blog.aggregate([
        //   // User
        //   {
        //     $lookup: {
        //       from: "users",
        //       localField: "user",
        //       foreignField: "_id",
        //       pipeline: [{ $project: { password: 0 } }],
        //       as: "user",
        //     },
        //   },
        //   { $unwind: "$user" },
        // ]);
        // // Example 3
        // const blogs = await Blog.aggregate([
        //   // User
        //   {
        //     $lookup: {
        //       from: "users",
        //       localField: "user",
        //       foreignField: "_id",
        //       as: "user",
        //     },
        //   },
        //   { $project: { "user.password": 0 } },
        //   { $unwind: "$user" },
        // ]);
        // Example 1
        const blogs = yield Blog_1.default.aggregate(getAggregate);
        res.json({ blogs });
    }),
    getBlogsByCategory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { limit, skip } = (0, exports.Pagination)(req);
            const Data = yield Blog_1.default.aggregate([
                {
                    $facet: {
                        totalData: [
                            {
                                $match: {
                                    category: new mongoose_1.default.Types.ObjectId(req.params.category_id),
                                },
                            },
                            {
                                $lookup: {
                                    from: "users",
                                    let: { user_id: "$user" },
                                    pipeline: [
                                        { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                        { $project: { password: 0 } },
                                    ],
                                    as: "user", // here you put the name of the input field
                                },
                            },
                            // array -> object
                            { $unwind: "$user" },
                            // Sorting
                            { $sort: { createdAt: -1 } },
                            { $skip: skip },
                            { $limit: limit },
                        ],
                        totalCount: [
                            {
                                $match: {
                                    category: new mongoose_1.default.Types.ObjectId(req.params.category_id),
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
            ]);
            const count = Data[0].count;
            let total = 0;
            if (count % limit === 0) {
                total = count / limit;
            }
            else {
                total = Math.floor(count / limit) + 1;
            }
            res.json({ blogs: Data[0].totalData, total });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getBlogsByUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { limit, skip } = (0, exports.Pagination)(req);
            const Data = yield Blog_1.default.aggregate([
                {
                    $facet: {
                        totalData: [
                            {
                                $match: {
                                    user: new mongoose_1.default.Types.ObjectId(req.params.id),
                                },
                            },
                            {
                                $lookup: {
                                    from: "users",
                                    let: { user_id: "$user" },
                                    pipeline: [
                                        { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                        { $project: { password: 0 } },
                                    ],
                                    as: "user", // here you put the name of the input field
                                },
                            },
                            // array -> object
                            { $unwind: "$user" },
                            // Sorting
                            { $sort: { createdAt: -1 } },
                            { $skip: skip },
                            { $limit: limit },
                        ],
                        totalCount: [
                            {
                                $match: {
                                    user: new mongoose_1.default.Types.ObjectId(req.params.id),
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
            ]);
            const count = Data[0].count;
            let total = 0;
            if (count % limit === 0) {
                total = count / limit;
            }
            else {
                total = Math.floor(count / limit) + 1;
            }
            res.json({ blogs: Data[0].totalData, total });
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    getBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const blog = yield Blog_1.default.findOne({ _id: req.params.id }).populate("user", "-password");
            if (!blog)
                return res.status(500).json({ msg: "Blog doesn't exist." });
            return res.json(blog);
        }
        catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }),
    editBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Invalid Authentication." });
        try {
            const { title, content, description, thumbnail, category } = req.body;
            const blog = yield Blog_1.default.findByIdAndUpdate(req.params.id, {
                user: req.user._id,
                title,
                content,
                description,
                thumbnail,
                category,
            }, { new: true }).populate("user", "-password");
            res.json({ blog, msg: "Blog Updated Successfully ✔" });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    deleteBlog: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Invalid Authentication." });
        const { id } = req.params;
        try {
            yield Blog_1.default.findByIdAndDelete(id);
            yield Comment_1.default.deleteMany({ blog_id: id });
            res.json({ msg: "Blog Deleted Successfully ✔" });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
    searchBlogs: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const blogs = yield Blog_1.default.aggregate([
                {
                    $search: {
                        index: "searchTitle",
                        autocomplete: {
                            query: `${req.query.title}`,
                            path: "title",
                        },
                    },
                },
                { $sort: { createdAt: -1 } },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        thumbnail: 1,
                        createdAt: 1,
                    },
                },
            ]);
            if (!blogs.length)
                return res.status(400).json({ msg: "No Blogs" });
            res.json(blogs);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }),
};
exports.default = blogCtrl;
