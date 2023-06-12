import mongoose from "mongoose";
import Blog from "../models/Blog";
import User from "../models/User";
import cloudinary from "../middleware/cloudinary";
import Comment from "../models/Comment";

export const getAllBlogs = async (req, res) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (err) {
    console.log(err);
  }
  if (!blogs) {
    res.status(404).json({ message: "No posts found" });
  }
  res.status(200).json({ blogs });
};

// add Post
export const addBlogs = async (req, res) => {
  try {
    let existingUser = await User.findById(req.body.user);
    if (!existingUser) {
      res.status(400).json({ message: "Unable to find user by this id" });
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    let blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      image: result.secure_url,
      cloudinary_id: result.public_id,
      user: req.body.user,
      topic: req.body.topic
    });
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
    res.json(blog);
  } catch (err) {
    // return res.status(500).json(err);
    console.log(err)
  }
};

//   update post
export const updatePost = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (blog.cloudinary_id) {
      await cloudinary.uploader.destroy(blog.cloudinary_id);
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    const data = {
      title: req.body.title || blog.title,
      topic: req.body.topic || blog.topic,
      content: req.body.content || blog.content,
      image: result.secure_url || image.image,
      cloudinary_id: result.public_id || blog.cloudinary_id,
    };
    blog = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json("Your post has been updated");
  } catch (err) {
    // return res.status(500).json(err);
    console.log(err);
  }
};

//   get a post
export const getPost = async (req, res) => {
  let blog;
  try {
    blog = await Blog.findById(req.params.id);
  } catch (err) {
    res.status(500).json(err);
  }
  if (!blog) {
    res.status(404).json({ message: "No post found" });
  }
  res.status(200).json({ blog });
};

// delete post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  let blog;
  try {
    let blogId = await Blog.findById(req.params.id);
    await cloudinary.uploader.destroy(blogId.cloudinary_id);
    blog = await Blog.findByIdAndRemove(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    return res.status(500).json(err);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable to delete" });
  }
  return res.status(200).json({ message: "Delete successfully" });
};

// get blog by user id
export const getBlogByUserId = async (req, res) => {
  const userId = req.params.id;
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate("blogs");
    const { password, ...other } = userBlogs._doc;
    res.status(200).json({ blogs: other });
  } catch (error) {
    console.log(error);
  }
  if (!userBlogs) {
    res.status(404).json({ message: "No post found" });
  }
};

// like a post
export const likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId;
  try {
    const post = await Blog.findById(postId);
    if (!post.like.includes(userId)) {
      await post.updateOne({ $push: { like: userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { like: userId } });
      res.status(403).json("The post has been unliked");
    }
  } catch (error) {
    res.status(500).json(err);
  }
};

// get post by following user
export const getPostByFollowing = async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Blog.find({ userId: currentUser._id });
    const followingPosts = await Promise.all(
      currentUser.followings.map((followingId) => {
        return Blog.find({ user: followingId });
      })
    );
    res.json(userPosts.concat(...followingPosts));
  } catch (err) {
    res.status(500).json(err);
  }
};

// get blog by topic
export const getPostByTopic = async (req, res) => {
  let blog;
  try {
    blog = await Blog.find( { topic: req.body.topic})
  } catch (err) {
    res.status(500).json(err);
  }
  if (!blog) {
    res.status(404).json({ message: "No post found" });
  }
  res.status(200).json({ blog });
};


