import { Request, Response } from "express";
import mongoose from "mongoose";
import Blog from "../models/Blog";
import Comment from "../models/Comment";
import { IReqAuth } from "./../config/interface";

const getAggregate: any = [
  // User
  {
    $lookup: {
      from: "users", // here you put the full collection name
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
      blogs: { $push: "$$ROOT" }, // "$$ROOT" refers to the remaining fields from the input document
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

export const Pagination = (
  req: IReqAuth
): { page: number; limit: number; skip: number } => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 4;
  let skip = (page - 1) * limit;

  return { page, limit, skip };
};

const blogCtrl = {
  createBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    try {
      const { title, content, description, thumbnail, category } = req.body;

      const newBlog = new Blog({
        user: req.user._id,
        title,
        content,
        description,
        thumbnail,
        category,
      });

      await newBlog.save();
      const blogs = await Blog.aggregate(getAggregate);
      res.json({ blogs, msg: "Blog Created Successfully ✔" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getHomeBlogs: async (req: IReqAuth, res: Response) => {
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
    const blogs = await Blog.aggregate(getAggregate);
    res.json({ blogs });
  },
  getBlogsByCategory: async (req: IReqAuth, res: Response) => {
    try {
      const { limit, skip } = Pagination(req);
      const Data = await Blog.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  category: new mongoose.Types.ObjectId(req.params.category_id),
                },
              },
              {
                $lookup: {
                  from: "users", // here you put the full collection name
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
                  category: new mongoose.Types.ObjectId(req.params.category_id),
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
      let total: number = 0;

      if (count % limit === 0) {
        total = count / limit;
      } else {
        total = Math.floor(count / limit) + 1;
      }
      res.json({ blogs: Data[0].totalData, total });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getBlogsByUser: async (req: Request, res: Response) => {
    try {
      const { limit, skip } = Pagination(req);
      const Data = await Blog.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  user: new mongoose.Types.ObjectId(req.params.id),
                },
              },
              {
                $lookup: {
                  from: "users", // here you put the full collection name
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
                  user: new mongoose.Types.ObjectId(req.params.id),
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
      let total: number = 0;

      if (count % limit === 0) {
        total = count / limit;
      } else {
        total = Math.floor(count / limit) + 1;
      }
      res.json({ blogs: Data[0].totalData, total });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getBlog: async (req: Request, res: Response) => {
    try {
      const blog = await Blog.findOne({ _id: req.params.id }).populate(
        "user",
        "-password"
      );
      if (!blog) return res.status(500).json({ msg: "Blog doesn't exist." });

      return res.json(blog);
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  editBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    try {
      const { title, content, description, thumbnail, category } = req.body;

      const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        {
          user: req.user._id,
          title,
          content,
          description,
          thumbnail,
          category,
        },
        { new: true }
      ).populate("user", "-password");

      res.json({ blog, msg: "Blog Updated Successfully ✔" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });
    const { id } = req.params;
    try {
      await Blog.findByIdAndDelete(id);
      await Comment.deleteMany({ blog_id: id });
      res.json({ msg: "Blog Deleted Successfully ✔" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  searchBlogs: async (req: IReqAuth, res: Response) => {
    try {
      const blogs = await Blog.aggregate([
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

      if (!blogs.length) return res.status(400).json({ msg: "No Blogs" });

      res.json(blogs);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default blogCtrl;
