import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      default: "",
    },
    image: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
      default: {},
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Comment", CommentSchema);

