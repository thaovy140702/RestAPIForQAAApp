import express from 'express'
import { addComment, deleteComment, getAllCommentByPost, getAllCommentByUser, updateComment } from '../controllers/commentController.js';
const router = express.Router();

router.get("/getbypost/:id", getAllCommentByPost)
router.get("/getbyuser/:id", getAllCommentByUser)
router.post("/addcomment", addComment)
router.put("/update/:id", updateComment )
router.delete("/delete/:id", deleteComment)
// router.get("/getbyuserid/:id", getBlogByUserId)
// router.put("/like/:id", likePost)
// router.get("/getpostbyfollow", getPostByFollowing)


export default router;