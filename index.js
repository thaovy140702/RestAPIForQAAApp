import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import userRouter from "./routes/user";
import authRouter from './routes/auth'
import postRouter from './routes/blog'
import commentRouter from './routes/comment'
import topicRouter from './routes/topic'



dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to mongoDB!"))
  .catch((err) => console.log(err));

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/comments", commentRouter)
app.use("/api/topic", topicRouter)

app.listen(process.env.PORT, () => {
    console.log("Backend server is running!")
})



