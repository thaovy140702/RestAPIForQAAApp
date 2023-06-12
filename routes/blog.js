import express from 'express'
import { addBlogs, deletePost, getAllBlogs, getBlogByUserId, getPost, getPostByFollowing, getPostByTopic, likePost, updatePost } from '../controllers/blogController';
import upload from '../middleware/multer'
const router = express.Router();

router.get("/getallposts", getAllBlogs)
router.get("/getpost/:id", getPost)
router.post("/addpost", upload.single("image") , addBlogs )
router.put("/update/:id", upload.single("image") , updatePost )
router.delete("/delete/:id", deletePost)
router.get("/getbyuserid/:id", getBlogByUserId)
router.put("/like/:id", likePost)
router.get("/getpostbyfollow", getPostByFollowing)
router.get("/getpostbytopic", getPostByTopic)


export default router;