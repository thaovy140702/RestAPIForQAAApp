import express from 'express'
import { changePassword, deleteUser, followUser, getAllUser, getUser, unfollowUser, updateUser } from '../controllers/userController.js';
import upload from '../middleware/multer'

const router = express.Router();

router.get("/getalluser",getAllUser)
router.put("/update/:id", upload.single("image") ,updateUser )
router.delete("/delete/:id", deleteUser )
router.put("/changepassword/:id", changePassword )
router.get("/getuser/:id", getUser)
router.put("/follow/:id", followUser)
router.put("/unfollow/:id", unfollowUser)

export default router;