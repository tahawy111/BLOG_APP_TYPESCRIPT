import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Add Your Category name"],
      trim: true,
      maxLength: [50, "Your Category name is up to 50 chars long."],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("categorie", categorySchema);
