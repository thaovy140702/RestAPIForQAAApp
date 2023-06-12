import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    profilePicture: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "",
      max: 255,
    },
    blogs: [{ type: mongoose.Types.ObjectId, ref: "Blog", default: [] }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment", default: [] }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
