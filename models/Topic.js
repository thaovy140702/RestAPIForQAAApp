import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TopicSchema = new Schema(
  {
    topicname: {
      type: String,
      max: 255
    },
    picture: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
    coverPicture: {
      type: String,
      default: "",
    },
    blogs: [{ type: mongoose.Types.ObjectId, ref: "Blog", default: [] }]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Topic", TopicSchema);
