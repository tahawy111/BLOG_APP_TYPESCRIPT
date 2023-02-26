import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Add your name"],
      trim: true,
      maxLength: [20, "Your name is up to 20 chars long."],
    },
    isActive: {
      type: Boolean,
      required: [true, "Please Add your Activation Status"],
    },
    age: {
      type: Number,
      required: [true, "Please Add your age"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please Add your Gender"],
    },
    eyeColor: {
      type: String,
      required: [true, "Please Add your eye color"],
    },
    favoriteFruit: {
      type: String,
      required: [true, "Please Add your favorite fruit"],
    },
    company: {
      type: Object,
      required: [true, "Please Add your company Details"],
    },
    tags: {
      type: Array,
      required: [true, "Please Add your Tags"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Test", categorySchema);
