import express from 'express'
import upload from '../middleware/multer'
import { addTopic, deleteTopic, getAllTopic, updateTopic } from '../controllers/topicControllers';
const router = express.Router();

router.get("/getalltopic", getAllTopic)
router.post("/addtopic", upload.single("image"), addTopic)
router.put("/update/:id", upload.single("image") , updateTopic)
router.delete("/delete/:id", deleteTopic)

export default router;