import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Add your name"],
      trim: true,
      maxLength: [20, "Your name is up to 20 chars long."],
    },
    account: {
      type: String,
      required: [true, "Please Add your email or phone"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add your password"],
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
    },
    role: {
      type: String,
      default: "user", // login
    },
    type: {
      type: String,
      default: "register", // fast
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user", userSchema);
