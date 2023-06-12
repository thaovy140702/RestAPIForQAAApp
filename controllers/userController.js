import User from "../models/User";
import bcrypt from "bcrypt";
import cloudinary from "../middleware/cloudinary";
import { passwordValidation } from "../validation";

// get all users
export const getAllUser = async (req, res) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    console.log(error);
  }
  if (!users) {
    return res.status(404).json({ message: "Not users found" });
  }
  return res.status(200).json({ users });
};
// get a user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password , ...other} = user._doc
    res.status(200).json(other)
  } catch (error) {
    res.status(500).json(err)
  }
}

// update user
export const updateUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      let user = await User.findById(req.params.id);
      if (user.cloudinary_id) {
        await cloudinary.uploader.destroy(user.cloudinary_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      
      const data = {
        username: req.body.username || user.username,
        profilePicture: result.secure_url || user.profilePicture,
        cloudinary_id: result.public_id || user.cloudinary_id,
        description: req.body.description || user.description,
      };
      user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
};

// delete user
export const deleteUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      let user = await User.findById(req.params.id);
      await cloudinary.uploader.destroy(user.cloudinary_id);
      await user.remove();
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
};

// change password
export const changePassword = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const { error } = passwordValidation(req.data);
      if (error) return res.status(400).send(error.details[0].message);

      let user = await User.findOne({ _id: req.params.id });
      if (!user) return res.status(400).send("Invalid user");

      const validPassWord = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassWord)
        return res.status(400).send("Your password is not correct");

      const salt = await bcrypt.genSalt(10);
      req.body.newpassword = await bcrypt.hash(req.body.newpassword, salt);

      const data = {
        password: req.body.newpassword
      };

      user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
      res.status(200).json("Change password successfully");
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(403).json("You can change password only your account!");
  }
};

// follow a user
export const followUser = async (req, res) => {
  if(req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)

      if(!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId}});
        await currentUser.updateOne({ $push: { followings: req.params.id}});
        res.status(200).json("User has been followed")
      } else {
        res.status(403).json("You have already followed this user")
      }
    } catch (error) {
      res.status(500).json(err)
    }
  } else {
    res.status(403).json("You can't follow myself")
  }
}

// unfollow a user
export const unfollowUser = async (req, res) => {
  if(req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)

      if(user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId}});
        await currentUser.updateOne({ $pull: { followings: req.params.id}});
        res.status(200).json("User has been unfollowed")
      } else {
        res.status(403).json("You don't follow this user")
      }
    } catch (error) {
      res.status(500).json(err)
    }
  } else {
    res.status(403).json("You can't unfollow myself")
  }
}


