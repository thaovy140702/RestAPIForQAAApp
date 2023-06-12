// add comment
import Blog from "../models/Blog";
import User from "../models/User";
import Comment from "../models/Comment";

// add comment
export const addComment = async (req, res) => {
  try {
    let existingPost = await Blog.findById(req.body.post);
    if (!existingPost) {
      res.status(400).json({ message: "Unable to find post by this id" });
    }
    // const result = await cloudinary.uploader.upload(req.file.path);
    let comment = new Comment({
      content: req.body.content,
      user: req.body.user,
      // image: result.secure_url,
      // cloudinary_id: result.public_id,
      post: req.body.post,
    });

    const currentUser = await User.findById(req.body.user);
    const currentPost = await Blog.findById(req.body.post);

    const saved = await comment.save();
    await currentUser.updateOne({ $push: { comments: saved._id } });
    await currentPost.updateOne({ $push: { comments: saved._id } });
    res.status(200).json({ comment: saved });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// get all comment by post
export const getAllCommentByPost = async (req, res) => {
  let comments;
  try {
    comments = await Comment.find({ post: req.params.id });
  } catch (err) {
    console.log(err);
  }
  if (!comments) {
    res.status(404).json({ message: "This post don't have any comment" });
  }
  res.status(200).json({ comments });
};

// get all comment by user
export const getAllCommentByUser = async (req, res) => {
  let comments;
  let postData = [];
  try {
    comments = await Comment.find({ user: req.params.id });
  } catch (err) {
    console.log(err);
  }

  if (!comments) {
    res.status(404).json({ message: "You don't have any comment" });
  }
  comments.forEach((data) => {
    postData.push(data.post);
  });
  console.log(postData);
  res.status(200).json({ comments, postData });
};

//   update comment
export const updateComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    // if (blog.cloudinary_id) {
    //   await cloudinary.uploader.destroy(blog.cloudinary_id);
    // }

    // const result = await cloudinary.uploader.upload(req.file.path);
    const data = {
      content: req.body.content || comment.content,
      // image: result.secure_url || image.profilePicture,
      // cloudinary_id: result.public_id || blog.cloudinary_id,
    };
    comment = await Comment.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json("Your comment has been updated");
  } catch (err) {
    // return res.status(500).json(err);
    console.log(err);
  }
};

// delete comment
export const deleteComment = async (req, res) => {
  const id = req.params.id;
  let comment;
  try {
    comment = await Comment.findByIdAndRemove(id)
    // let blogId = await Blog.findById(req.params.id);
    // await cloudinary.uploader.destroy(blogId.cloudinary_id);

    const currentUser = await User.findById(req.body.user);
    const currentPost = await Blog.find({
      comments: { $elemMatch: { $eq: id } }
    });
    
    await currentUser.updateOne({ $pull: { comments: id } });
    currentPost.forEach(async (data) => {
      await data.updateOne({ $pull: { comments: id } });
    })
  } catch (err) {
    // return res.status(500).json(err);
    console.log(err);
  }
  if (!comment) {
    return res.status(500).json({ message: "Unable to delete" });
  }
  return res.status(200).json({ message: "Delete successfully" });
};
