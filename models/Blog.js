import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
      default: "",
    },
    image: {
      type: String,
    },
    topic: {
      type: String,
      default: "",
    },
    cloudinary_id: {
      type: String,
    },
    like: {
      type: Array,
      default: [],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: {},
    },
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment", default: [] }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Blog", BlogSchema);

