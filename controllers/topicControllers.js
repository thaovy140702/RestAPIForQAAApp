import mongoose from "mongoose";
import cloudinary from "../middleware/cloudinary";
import Topic from "../models/Topic.js";

// get topic
export const getAllTopic = async (req, res) => {
    let topics;
    try {
      topics = await Topic.find();
    } catch (err) {
      console.log(err);
    }
    if (!topics) {
      res.status(404).json({ message: "No topic found" });
    }
    res.status(200).json({ topics });
  };

// add topic
export const addTopic = async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      let topic = new Topic({
        topicname: req.body.topicname,
        picture: result.secure_url,
        cloudinary_id: result.public_id
      });
      const savedTopic = await topic.save();
      res.status(200).json({ topic: savedTopic });
    } catch (err) {
      return res.status(500).json(err);
    }
  };

//   update topic
export const updateTopic = async (req, res) => {
    try {
      let topic = await Topic.findById(req.params.id);
      if (topic.cloudinary_id) {
        await cloudinary.uploader.destroy(topic.cloudinary_id);
      }
  
      const result = await cloudinary.uploader.upload(req.file.path);
      const data = {
        topicname: req.body.topicname || topic.topicname,
        picture: result.secure_url || topic.picture,
        cloudinary_id: result.public_id || topic.cloudinary_id,
      };
      topic = await Topic.findByIdAndUpdate(req.params.id, data, { new: true });
      res.status(200).json("The topic has been updated");
    } catch (err) {
      // return res.status(500).json(err);
      console.log(err);
    }
  };

// delete post
export const deleteTopic = async (req, res) => {
    const id = req.params.id;
  let topic;
  try {
    topic = await Topic.findByIdAndRemove(id)
    let topicId = await Topic.findById(id);
    await cloudinary.uploader.destroy(topicId.cloudinary_id);

  } catch (err) {
    // return res.status(500).json(err);
    console.log(err);
  }
  if (!topic) {
    return res.status(500).json({ message: "Unable to delete" });
  }
  return res.status(200).json({ message: "Delete successfully" });
  };