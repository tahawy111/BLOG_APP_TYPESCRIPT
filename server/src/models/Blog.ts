import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    title: {
      type: String,
      required: [true, "Please Add Your Blog name"],
      trim: true,
      minLength: [10, "Your Blog title must be at least 10 chars long."],
      maxLength: [50, "Your Blog title must be at most 50 chars long."],
    },
    description: {
      type: String,
      require: true,
      trim: true,
      minLength: 50,
      maxLength: 200,
    },
    content: {
      type: String,
      required: [true, "Please Add Your Blog name"],
      trim: true,
      minLength: [2000, "Your Blog content must be at least 2000 chars long."],
    },
    thumbnail: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "categorie",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("blog", blogSchema);
