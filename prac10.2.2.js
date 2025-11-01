import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcryptjs";
import { User, Post, Comment } from "./models.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/blogPlatform");

// JWT secret key
const SECRET = "supersecretkey";

// 🔹 Middleware to verify JWT
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
}

// 🔹 Signup
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();
  res.json({ message: "User registered" });
});

// 🔹 Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user._id, username }, SECRET);
  res.json({ token });
});

// 🔹 Create Post
app.post("/posts", auth, async (req, res) => {
  const post = new Post({ user: req.user.id, title: req.body.title, content: req.body.content });
  await post.save();
  res.json(post);
});

// 🔹 Get All Posts
app.get("/posts", async (_, res) => {
  const posts = await Post.find().populate("user", "username");
  res.json(posts);
});

// 🔹 Add Comment
app.post("/posts/:id/comments", auth, async (req, res) => {
  const comment = new Comment({ post: req.params.id, user: req.user.id, text: req.body.text });
  await comment.save();
  res.json(await comment.populate("user", "username"));
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
