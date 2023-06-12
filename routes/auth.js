import express from 'express'
import { login, logout, newAccessToken, register } from '../controllers/authController.js';

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/token", newAccessToken)
router.delete("/logout", logout)

export default router;